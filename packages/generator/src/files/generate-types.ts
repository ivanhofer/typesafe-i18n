import {
	filterDuplicates,
	filterDuplicatesByKey,
	isArrayNotEmpty,
	isNotUndefined,
	isNotZero,
	isObject,
	isPropertyFalsy,
	isPropertyTrue,
	not,
	sortNumberASC,
	sortStringASC,
	sortStringPropertyASC,
} from 'typesafe-utils'
import { parseRawText } from '../../../core/src/parser'
import { isPluralPart, BaseTranslation } from '../../../core/src/core'
import type { ArgumentPart } from '../../../core/src/parser'
import { writeFileIfContainsChanges } from '../file-utils'
import type { GeneratorConfigWithDefaultValues } from '../generate-files'
import { removeEmptyValues, partsAsStringWithoutTypes, partAsStringWithoutTypes } from '../../../core/src/core-utils'
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

type ParsedResult = {
	key: string
	text: string
	textWithoutTypes: string
	args: Arg[]
	types: Types
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
	entries
		.map(
			(locale) => `
	| '${locale}'`,
		)
		.join('')

// --------------------------------------------------------------------------------------------------------------------

const parseTranslations = (translations: BaseTranslation, logger: Logger) =>
	isObject(translations)
		? Object.entries(translations).map((translation) => parseTanslationEntry(translation, logger))
		: []

const parseTanslationEntry = ([key, text]: [string, string], logger: Logger): ParsedResult => {
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

	checkForMissingArgs(key, types, logger)

	return removeEmptyValues({ key, text, textWithoutTypes, args, types })
}

// display warning when wrong key found in translation
//  - if keyed and index-based args are mixed together
//  - index-based args have a missing index
const checkForMissingArgs = (key: string, types: Types, logger: Logger) => {
	const base = `translation '${key}' =>`

	const argKeys = Object.keys(types).sort(sortStringASC)
	if (isArrayNotEmpty(argKeys) && !isNaN(+argKeys[0])) {
		let expectedKey = '0'
		argKeys.forEach((argKey) => {
			if (argKey !== expectedKey) {
				logger.warn(`${base} argument {${expectedKey}} expected, but {${argKey}} found`)
				if (isNaN(+argKey)) {
					logger.warn(`${base} you can't mix keyed and index-based args`)
				} else {
					logger.warn(`${base} make sure to not skip an index`)
				}
			}
			expectedKey = (+argKey + 1).toString()
		})
	}
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

const createTypeImports = (
	parsedTranslations: ParsedResult[],
	typesTemplatePath: string,
	importType: string,
): string => {
	const types = parsedTranslations.flatMap(({ types }) => Object.values(types).flat()).filter(filterDuplicates)

	const externalTypes = Array.from(types)
		.filter((type) => !BASE_TYPES.includes(type))
		.sort(sortStringASC)

	return !externalTypes.length
		? ''
		: `
${importType} { ${externalTypes.join(', ')} } from './${typesTemplatePath.replace('.ts', '')}'
`
}

// --------------------------------------------------------------------------------------------------------------------

const createTranslationKeysType = (parsedTranslations: ParsedResult[]) => {
	const keys = parsedTranslations.map(({ key }) => key)

	return `export type TranslationKeys =${wrapUnionType(keys)}`
}

// --------------------------------------------------------------------------------------------------------------------

const createJsDocsMapping = (parsedTranslations: ParsedResult[]) => {
	const map = {} as JsDocInfos
	parsedTranslations.forEach(({ key, textWithoutTypes, types, args }) => {
		map[key] = {
			text: textWithoutTypes,
			types,
			pluralOnlyArgs: args.filter(isPropertyTrue('pluralOnly')).map(({ key }) => key),
		}
	})

	return map
}

const createJsDocsString = (
	{ text, types, pluralOnlyArgs }: JsDocInfo,
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

	return `/**
	 * ${text}${renderedTypes}
	 */
	`
}

const createJsDocsParamString = ([paramName, types]: [string, string[]]) => `
	 * @param {${types.join(' | ')}} ${paramName}`

// --------------------------------------------------------------------------------------------------------------------

const createTranslationType = (
	parsedTranslations: ParsedResult[],
	jsDocInfo: JsDocInfos,
	paramTypesToGenerate: number[],
	generateTemplateLiteralTypes: boolean,
) =>
	`export type Translation = ${wrapObjectType(parsedTranslations, () =>
		parsedTranslations
			.map(
				({ key, args }) =>
					`
	${createJsDocsString(jsDocInfo[key] as JsDocInfo, true, false)}'${key}': ${generateTranslationType(
						paramTypesToGenerate,
						args,
						generateTemplateLiteralTypes,
					)}`,
			)
			.join(''),
	)}`

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
		? `RequiredParams${nrOfArgs}<${argStrings.map((arg) => `'${arg}'`).join(', ')}>`
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
${baseTypes?.join(`
`)}
${permutationTypes?.join(`
`)}
`
}

const generateParamType = (nrOfParams: number): [string, string] => {
	const args = new Array(nrOfParams).fill(0).map((_, i) => i + 1)

	const baseType = generateBaseType(args)
	const permutationType = generatePermutationType(args)

	return [baseType, permutationType]
}

const generateBaseType = (args: number[]) => {
	const generics = args.map((i) => `P${i} extends string`).join(', ')
	const params = args.map((i) => `\${Param<P${i}>}`).join(`\${string}`)

	return `
type Params${args.length}<${generics}> =
	\`\${string}${params}\${string}\``
}

const generatePermutationType = (args: number[]) => {
	const l = args.length
	const generics = args.map((i) => `P${i} extends string`).join(', ')

	const permutations = getPermutations(args)

	return `
type RequiredParams${l}<${generics}> =${permutations
			.map(
				(permutation) => `
	| Params${l}<${permutation.map((p) => `P${p}`).join(', ')}>`,
			)
			.join('')}`
}

// --------------------------------------------------------------------------------------------------------------------
const createTranslationsArgsType = (parsedTranslations: ParsedResult[], jsDocInfo: JsDocInfos) =>
	`export type TranslationFunctions = ${wrapObjectType(parsedTranslations, () =>
		parsedTranslations
			.map(
				(translation) =>
					`
	${createTranslationArgsType(translation, jsDocInfo)}`,
			)
			.join(''),
	)}`

const createTranslationArgsType = ({ key, args, types }: ParsedResult, jsDocInfo: JsDocInfos) =>
	`${createJsDocsString(jsDocInfo[key] as JsDocInfo)}'${key}': (${mapTranslationArgs(args, types)}) => string`

const mapTranslationArgs = (args: Arg[], types: Types) => {
	if (!args.length) {
		return ''
	}

	const uniqueArgs = args.filter(filterDuplicatesByKey('key'))
	const arg = uniqueArgs[0]?.key as string

	const isKeyed = isNaN(+arg)
	const prefix = (isKeyed && 'arg: { ') || ''
	const postfix = (isKeyed && ' }') || ''
	const argPrefix = (!isKeyed && 'arg') || ''

	return prefix + uniqueArgs.map(({ key }) => `${argPrefix}${key}: ${types[key]?.join(' | ')}`).join(', ') + postfix
}

// --------------------------------------------------------------------------------------------------------------------

const getUniqueFormatters = (parsedTranslations: ParsedResult[]): [string, string[]][] => {
	const map = {} as Types
	parsedTranslations.forEach(({ types, args }) =>
		args.forEach(({ key, formatters }) =>
			(formatters || []).forEach(
				(formatter) => (map[formatter] = [...(map[formatter] || []), ...(types[key] || [])]),
			),
		),
	)

	return Object.entries(map).sort(sortStringPropertyASC('0'))
}

const createFormattersType = (parsedTranslations: ParsedResult[]) => {
	const formatters = getUniqueFormatters(parsedTranslations)

	return `export type Formatters = ${wrapObjectType(formatters, () =>
		formatters
			.map(
				([key, types]) =>
					`
	'${key}': (value: ${types?.join(' | ')}) => unknown`,
			)
			.join(''),
	)}`
}

// --------------------------------------------------------------------------------------------------------------------

const getTypes = (
	{ translations, baseLocale, locales, typesTemplateFileName }: GenerateTypesType,
	importType: string,
	version: TypescriptVersion,
	logger: Logger,
) => {
	const parsedTranslations = parseTranslations(translations, logger)

	const typeImports = createTypeImports(parsedTranslations, typesTemplateFileName, importType)

	const localesType = createLocalesType(locales, baseLocale)

	const translationKeysType = createTranslationKeysType(parsedTranslations)

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

	const translationArgsType = createTranslationsArgsType(parsedTranslations, jsDocsInfo)

	const formattersType = createFormattersType(parsedTranslations)

	const type = `// This types were auto-generated. Any manual changes will be overwritten.
/* eslint-disable */
${typeImports}
export type BaseLocale = '${baseLocale}'

${localesType}

${translationKeysType}

${translationType}

${translationArgsType}

${formattersType}

${paramsType}`

	return [type, !!typeImports] as [string, boolean]
}

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
