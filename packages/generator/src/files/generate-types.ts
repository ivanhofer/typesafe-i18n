import {
	filterDuplicates,
	filterDuplicatesByKey,
	isArray,
	isArrayNotEmpty,
	isNotUndefined,
	isNotZero,
	isObject,
	isPropertyFalsy,
	isPropertyTrue,
	isString,
	isTruthy,
	not,
	sortNumberASC,
	sortStringASC,
	sortStringPropertyASC
} from 'typesafe-utils'
import { BaseTranslation, isPluralPart } from '../../../core/src/core'
import { partAsStringWithoutTypes, partsAsStringWithoutTypes, removeEmptyValues } from '../../../core/src/core-utils'
import type { ArgumentPart } from '../../../core/src/parser'
import { parseRawText } from '../../../core/src/parser'
import { writeFileIfContainsChanges } from '../file-utils'
import type { GeneratorConfigWithDefaultValues } from '../generate-files'
import { getPermutations, Logger, supportsTemplateLiteralTypes, TypescriptVersion } from '../generator-util'

// --------------------------------------------------------------------------------------------------------------------
// types --------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------

type Arg = {
	key: string
	formatters?: string[]
	pluralOnly?: boolean
}

type Types = {
	[key: string]: string[]
}

type JsDocInfos = {
	[key: string]: JsDocInfo
}

type JsDocInfo = {
	text: string
	types: Types
	pluralOnlyArgs: string[]
}

type ParsedResultEntry = {
	key: string
	text: string
	textWithoutTypes: string
	args: Arg[]
	types: Types
	parentKeys: string[]
}

type ParsedResult =
	| ParsedResultEntry
	| {
		[key: string]: ParsedResult[]
	}

// --------------------------------------------------------------------------------------------------------------------
// implementation -----------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------

const wrapObjectType = <T>(array: T[], callback: () => string) =>
	!array.length
		? '{}'
		: `{${callback()}
}`

const wrapUnionType = (array: string[]) => (!array.length ? ' never' : `${createUnionType(array)}`)

const createUnionType = (entries: string[]) =>
	mapToString(
		entries,
		(locale) => `
	| '${locale}'`,
	)


const NEW_LINE = `
`
const NEW_LINE_INDENTED = `
	`
const COMMA_SEPARATION = ', '

const mapToString = <T>(items: T[], mappingFunction: (item: T) => string): string =>
	items.map(mappingFunction).join('')

const processNestedParsedResult = (items: Exclude<ParsedResult, ParsedResultEntry>, mappingFunction: (item: ParsedResult) => string): string =>
(NEW_LINE_INDENTED +
	mapToString(Object.entries(items), ([key, parsedResults]) =>
		`'${key}': {${mapToString(parsedResults, mappingFunction)
			.split(/\r?\n/)
			.map((line) => `	${line}`).join(NEW_LINE)}
	}`
	)
)

const getNestedKey = (key: string, parentKeys: string[]) =>
	[...parentKeys, key].join('.')


const flattenToParsedResultEntry = (parsedResults: ParsedResult[]): ParsedResultEntry[] => parsedResults.flatMap((parsedResult) => (isParsedResultEntry(parsedResult))
	? parsedResult
	: Object.entries(parsedResult).flatMap(([_, nestedParsedResults]) => flattenToParsedResultEntry(nestedParsedResults))
)

// --------------------------------------------------------------------------------------------------------------------

const parseTranslations = (translations: BaseTranslation, logger: Logger, parentKeys = [] as string[]): ParsedResult[] =>
	isObject(translations)
		? Object.entries(translations).map(([key, text]) => {
			if (isString(text)) {
				return parseTanslationEntry([key, text], logger, parentKeys) as ParsedResultEntry
			}
			return { [key]: parseTranslations(text, logger, [...parentKeys, key]) } as ParsedResult
		})
		: []

const parseTanslationEntry = ([key, text]: [string, string], logger: Logger, parentKeys: string[]): ParsedResult | null => {
	const parsedParts = parseRawText(text, false)
	const textWithoutTypes = partsAsStringWithoutTypes(parsedParts)

	const parsedObjects = parsedParts.filter(isObject)
	const argumentParts = parsedObjects.filter<ArgumentPart>(not(isPluralPart))
	const pluralParts = parsedObjects.filter(isPluralPart)

	const args: Arg[] = []
	const types: Types = {}

	argumentParts.forEach(({ k, i, f }) => {
		args.push({ key: k, formatters: f })
		types[k] = Array.from(new Set([...(types[k] || []), i])).filter(isNotUndefined)
	})

	pluralParts.forEach(({ k }) => {
		if (!types[k]?.length) {
			// if key has no types => add types that are valid for a PluralPart
			types[k] = ['string', 'number', 'boolean']
			if (!args.find(({ key }) => key === k)) {
				// if only pluralpart exists => add it as argument
				args.push({ key: k, formatters: [], pluralOnly: true })
			}
		}
	})

	// add 'unknown' if argument has no type
	Object.keys(types).forEach((key) => {
		if (!types[key]?.length) {
			types[key] = ['unknown']
		}
	})

	args.sort(sortStringPropertyASC('key'))

	const isValid = validateTranslation(key, types, logger)

	if (!isValid) return null

	return removeEmptyValues({ key, text, textWithoutTypes, args, types, parentKeys })
}

const validateTranslation = (key: string, types: Types, logger: Logger): boolean => {
	const base = `translation '${key}' =>`

	if (key.includes('.')) {
		logger.error(`${base} key can't contain the '.' character. Please remove it. If you want to nest keys, you should look at https://github.com/ivanhofer/typesafe-i18n#nested-translations`)
		return false
	}

	const argKeys = Object.keys(types).sort(sortStringASC)
	if (isArrayNotEmpty(argKeys) && !isNaN(+argKeys[0])) {
		let expectedKey = '0'
		for (const argKey of argKeys) {
			if (argKey !== expectedKey) {
				const info = (isNaN(+argKey))
					? (`You can't mix keyed and index-based arguments.`)
					: (`Make sure to not skip an index for your arguments.`)

				logger.error(`${base} argument {${expectedKey}} expected, but {${argKey}} found.`, info)
				return false
			}
			expectedKey = (+argKey + 1).toString()
		}
	}

	return true
}

// --------------------------------------------------------------------------------------------------------------------

const createLocalesType = (locales: string[], baseLocale: string) => {
	const usedLocales = locales?.length ? locales : [baseLocale]
	return `export type Locales =${wrapUnionType(usedLocales)}`
}

// --------------------------------------------------------------------------------------------------------------------

const BASE_TYPES = ['boolean', 'number', 'bigint', 'string', 'Date', 'object', 'undefined', 'null', 'unknown'].flatMap(
	(t: string) => [t, `${t}[]`],
)

type IsParsedResultEntry<T> = T extends ParsedResultEntry ? T : never

const isParsedResultEntry = <T extends ParsedResult>(entry: T): entry is IsParsedResultEntry<T> =>
	isArray(entry.parentKeys) && isObject(entry.types)

const extractTypes = (parsedTranslations: ParsedResult[]): string[] =>
	parsedTranslations.flatMap((parsedTranslation) => {
		if (isParsedResultEntry(parsedTranslation)) {
			return Object.values(parsedTranslation.types).flat() as string[]
		}

		return extractTypes(Object.values(parsedTranslation).flat())
	})

const createTypeImports = (
	parsedTranslations: ParsedResult[],
	typesTemplatePath: string,
	importType: string,
): string => {
	const types = extractTypes(parsedTranslations).filter(filterDuplicates)

	const externalTypes = Array.from(types)
		.filter((type) => !BASE_TYPES.includes(type))
		.sort(sortStringASC)

	return !externalTypes.length
		? ''
		: `
${importType} { ${externalTypes.join(COMMA_SEPARATION)} } from './${typesTemplatePath.replace('.ts', '')}'
`
}

// --------------------------------------------------------------------------------------------------------------------

const createJsDocsMapping = (parsedTranslations: ParsedResult[]) => {
	const map = {} as JsDocInfos

	flattenToParsedResultEntry(parsedTranslations).forEach((parsedResultEntry) => {
		const { key, textWithoutTypes, types, args, parentKeys } = parsedResultEntry
		const nestedKey = getNestedKey(key, parentKeys)
		map[nestedKey] = {
			text: textWithoutTypes,
			types,
			pluralOnlyArgs: args.filter(isPropertyTrue('pluralOnly')).map(({ key }) => key)
		}
	})

	return map
}

const createJsDocsString = (
	{ text, types, pluralOnlyArgs }: JsDocInfo = {} as JsDocInfo,
	renderTypes = false,
	renderPluralOnlyArgs = true,
) => {
	const renderedTypes = renderTypes
		? `${Object.entries(types || {})
			.filter(({ '0': key }) => renderPluralOnlyArgs || !pluralOnlyArgs.includes(key))
			.sort(sortStringPropertyASC('0'))
			.map(createJsDocsParamString)
			.join('')}`
		: ''

	return (text?.length + renderedTypes.length) ? `/**
	 * ${text}${renderedTypes}
	 */
	` : ''
}

const createJsDocsParamString = ([paramName, types]: [string, string[]]) => `
	 * @param {${types.join(' | ')}} ${paramName}`

// --------------------------------------------------------------------------------------------------------------------

const createTranslationType = (
	parsedTranslations: ParsedResult[],
	jsDocInfo: JsDocInfos,
	paramTypesToGenerate: number[],
	generateTemplateLiteralTypes: boolean,
): string =>
	`export type Translation = ${wrapObjectType(parsedTranslations, () =>
		mapToString(parsedTranslations, (parsedResultEntry) =>
			createTranslationTypeEntry(parsedResultEntry, jsDocInfo, paramTypesToGenerate, generateTemplateLiteralTypes),
		),
	)}`

const createTranslationTypeEntry = (
	resultEntry: ParsedResult,
	jsDocInfo: JsDocInfos,
	paramTypesToGenerate: number[],
	generateTemplateLiteralTypes: boolean,
): string => {
	if (isParsedResultEntry(resultEntry)) {
		const { key, args, parentKeys } = resultEntry

		const nestedKey = getNestedKey(key, parentKeys)
		const jsDocString = createJsDocsString((jsDocInfo[nestedKey] as JsDocInfo), true, false)
		const translationType = generateTranslationType(paramTypesToGenerate, args, generateTemplateLiteralTypes)

		return `
	${jsDocString}'${key}': ${translationType}`
	}

	return processNestedParsedResult(resultEntry, (parsedResultEntry) =>
		createTranslationTypeEntry(parsedResultEntry, jsDocInfo, paramTypesToGenerate, generateTemplateLiteralTypes))
}

const REGEX_BRACKETS = /[{}]/g

const generateTranslationType = (
	paramTypesToGenerate: number[],
	args: Arg[],
	generateTemplateLiteralTypes: boolean,
) => {
	const argStrings = args
		.filter(isPropertyFalsy('pluralOnly'))
		.map(({ key, formatters }) => partAsStringWithoutTypes({ k: key, f: formatters }).replace(REGEX_BRACKETS, ''))

	const nrOfArgs = argStrings.length
	paramTypesToGenerate.push(nrOfArgs)

	return generateTemplateLiteralTypes && nrOfArgs
		? `RequiredParams${nrOfArgs}<${argStrings.map((arg) => `'${arg}'`).join(COMMA_SEPARATION)}>`
		: 'string'
}

// --------------------------------------------------------------------------------------------------------------------

const createParamsType = (paramTypesToGenerate: number[]) => {
	const filteredParamTypes = paramTypesToGenerate.filter(filterDuplicates).filter(isNotZero).sort(sortNumberASC)

	if (filteredParamTypes.length === 0) {
		return ''
	}

	const result = filteredParamTypes.map(generateParamType)

	const baseTypes = result.map(([baseType]) => baseType)
	const permutationTypes = result.map(([_, permutationTypes]) => permutationTypes)

	return `
type Param<P extends string> = \`{\${P}}\`
${baseTypes?.join(NEW_LINE)}
${permutationTypes?.join(NEW_LINE)}
`
}

const generateParamType = (nrOfParams: number): [string, string] => {
	const args = new Array(nrOfParams).fill(0).map((_, i) => i + 1)

	const baseType = generateBaseType(args)
	const permutationType = generatePermutationType(args)

	return [baseType, permutationType]
}

const generateBaseType = (args: number[]) => {
	const generics = args.map((i) => `P${i} extends string`).join(COMMA_SEPARATION)
	const params = args.map((i) => `\${Param<P${i}>}`).join(`\${string}`)

	return `
type Params${args.length}<${generics}> =
	\`\${string}${params}\${string}\``
}

const generatePermutationType = (args: number[]) => {
	const l = args.length
	const generics = args.map((i) => `P${i} extends string`).join(COMMA_SEPARATION)

	const permutations = getPermutations(args)

	return `
type RequiredParams${l}<${generics}> =${mapToString(permutations
		,
		(permutation) => `
	| Params${l}<${permutation.map((p) => `P${p}`).join(COMMA_SEPARATION)}>`,
	)}`
}

// --------------------------------------------------------------------------------------------------------------------

const createTranslationsArgsType = (parsedTranslations: ParsedResult[], jsDocInfo: JsDocInfos) =>
	`export type TranslationFunctions = ${wrapObjectType(parsedTranslations, () =>
		mapToString(parsedTranslations,
			(translation) => createTranslationArgsType(translation, jsDocInfo)),
	)}`

const createTranslationArgsType = (parsedResult: ParsedResult, jsDocInfo: JsDocInfos): string => {
	if (isParsedResultEntry(parsedResult)) {
		const { key, args, types, parentKeys } = parsedResult
		const nestedKey = getNestedKey(key, parentKeys)
		const jsDocString = createJsDocsString((jsDocInfo[nestedKey] as JsDocInfo))

		return `
	${jsDocString}'${key}': (${mapTranslationArgs(args, types,)}) => LocalizedString`
	}

	return processNestedParsedResult(parsedResult, (parsedResultEntry) => createTranslationArgsType(parsedResultEntry, jsDocInfo))
}

const mapTranslationArgs = (args: Arg[], types: Types) => {
	if (!args.length) return ''


	const uniqueArgs = args.filter(filterDuplicatesByKey('key'))
	const arg = uniqueArgs[0]?.key as string

	const isKeyed = isNaN(+arg)
	const prefix = (isKeyed && 'arg: { ') || ''
	const postfix = (isKeyed && ' }') || ''
	const argPrefix = (!isKeyed && 'arg') || ''

	return prefix + uniqueArgs.map(({ key }) => `${argPrefix}${key}: ${types[key]?.join(' | ')}`).join(COMMA_SEPARATION) + postfix
}

// --------------------------------------------------------------------------------------------------------------------

const getUniqueFormatters = (parsedTranslations: ParsedResult[]): [string, string[]][] => {
	const map = {} as Types

	flattenToParsedResultEntry(parsedTranslations)
		.forEach((parsedResult) => {
			const { types, args } = parsedResult
			args.forEach(({ key, formatters }) =>
				(formatters || []).forEach(
					(formatter) => (map[formatter] = [...(map[formatter] || []), ...(types[key] || [])]),
				),
			)
		})

	return Object.entries(map).sort(sortStringPropertyASC('0'))
}

const createFormattersType = (parsedTranslations: ParsedResult[]) => {
	const formatters = getUniqueFormatters(parsedTranslations)

	return `export type Formatters = ${wrapObjectType(formatters, () =>
		mapToString(formatters,
			([key, types]) =>
				`
	'${key}': (value: ${types?.join(' | ')}) => unknown`,
		),
	)}`
}

// --------------------------------------------------------------------------------------------------------------------

const getTypes = (
	{ translations, baseLocale, locales, typesTemplateFileName, banner }: GenerateTypesType,
	importType: string,
	version: TypescriptVersion,
	logger: Logger,
) => {
	const parsedTranslations = parseTranslations(translations, logger).filter(isTruthy)

	const typeImports = createTypeImports(parsedTranslations, typesTemplateFileName, importType)

	const localesType = createLocalesType(locales, baseLocale)

	const jsDocsInfo = createJsDocsMapping(parsedTranslations)

	const generateTemplateLiteralTypes = supportsTemplateLiteralTypes(version)

	const paramTypesToGenerate: number[] = []
	const translationType = createTranslationType(
		parsedTranslations,
		jsDocsInfo,
		paramTypesToGenerate,
		generateTemplateLiteralTypes,
	)

	const paramsType = generateTemplateLiteralTypes ? createParamsType(paramTypesToGenerate) : ''

	const imports = parsedTranslations.length ? `
import type { LocalizedString } from 'typesafe-i18n'
` : ''

	const translationArgsType = createTranslationsArgsType(parsedTranslations, jsDocsInfo)

	const formattersType = createFormattersType(parsedTranslations)

	const type = `// This types were auto-generated. Any manual changes will be overwritten.
${banner}
${imports}${typeImports}
export type BaseLocale = '${baseLocale}'

${localesType}

${translationType}

${translationArgsType}

${formattersType}

${paramsType}`

	return [type, !!typeImports] as [string, boolean]
}

// --------------------------------------------------------------------------------------------------------------------

type GenerateTypesType = GeneratorConfigWithDefaultValues & {
	translations: BaseTranslation
}

export const generateTypes = async (
	config: GenerateTypesType,
	importType: string,
	version: TypescriptVersion,
	logger: Logger,
): Promise<boolean> => {
	const { outputPath, typesFileName } = config

	const [types, hasCustomTypes] = getTypes(config, importType, version, logger)

	await writeFileIfContainsChanges(outputPath, typesFileName, types)

	return hasCustomTypes
}
