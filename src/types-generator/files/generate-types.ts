import {
	filterDuplicates,
	filterDuplicatesByKey,
	isNotUndefined,
	isNotZero,
	isObject,
	not,
	sortNumberASC,
	sortStringASC,
	sortStringPropertyASC,
} from 'typesafe-utils'
import { parseRawText } from '../../core/parser'
import { isPluralPart, LangaugeBaseTranslation } from '../../core/core'
import type { ArgumentPart } from '../../core/parser'
import { writeFileIfContainsChanges } from '../file-utils'
import type { GeneratorConfigWithDefaultValues } from '../generator'
import { removeEmptyValues, partsAsStringWithoutTypes, partAsStringWithoutTypes } from '../../core/core-utils'
import { getPermutations, supportsTemplateLiteralTypes } from '../generator-util'

// --------------------------------------------------------------------------------------------------------------------
// types --------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------

type Arg = {
	key: string
	formatters?: string[]
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

const wrapObjectType = (array: unknown[], callback: () => string) =>
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

const parseTranslations = (translations: LangaugeBaseTranslation) =>
	isObject(translations) ? Object.entries(translations).map(parseTanslationEntry) : []

const parseTanslationEntry = ([key, text]: [string, string]): ParsedResult => {
	const parsedParts = parseRawText(text)
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
				args.push({ key: k, formatters: [] })
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

	return removeEmptyValues({ key, text, textWithoutTypes, args, types })
}

// --------------------------------------------------------------------------------------------------------------------

const createLocalesType = (locales: string[], baseLocale: string) => {
	const usedLocales = locales?.length ? locales : [baseLocale]
	return `export type LangaugeLocale =${wrapUnionType(usedLocales)}`
}

// --------------------------------------------------------------------------------------------------------------------

const BASE_TYPES = [
	'boolean',
	'number',
	'bigint',
	'string',
	'Date',
	'object',
	'undefined',
	'null',
	'unknown',
].flatMap((t: string) => [t, `${t}[]`])

const createTypeImportsType = (
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
import${importType} { ${externalTypes.join(', ')} } from './${typesTemplatePath.replace('.ts', '')}'
`
}

// --------------------------------------------------------------------------------------------------------------------

const createTranslationKeysType = (parsedTranslations: ParsedResult[]) => {
	const keys = parsedTranslations.map(({ key }) => key)

	return `export type LangaugeTranslationKeys =${wrapUnionType(keys)}`
}

// --------------------------------------------------------------------------------------------------------------------

const createJsDocsMapping = (parsedTranslations: ParsedResult[]) => {
	const map = {} as JsDocInfos
	parsedTranslations.forEach(({ key, textWithoutTypes, types }) => {
		map[key] = {
			text: textWithoutTypes,
			types,
		}
	})

	return map
}

const createJsDocsString = ({ text, types }: JsDocInfo, renderTypes = false) => {
	const renderedTypes = renderTypes
		? `${Object.entries(types || {})
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
	`export type LangaugeTranslation = ${wrapObjectType(parsedTranslations, () =>
		parsedTranslations
			.map(
				({ key, args }) =>
					`
	${createJsDocsString(jsDocInfo[key] as JsDocInfo, true)}'${key}': ${generateTranslationType(
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
	const argStrings = args.map(({ key, formatters }) =>
		partAsStringWithoutTypes({ k: key, f: formatters }).replace(REGEX_BRACKETS, ''),
	)

	const nrOfArgs = argStrings.length
	paramTypesToGenerate.push(nrOfArgs)

	return generateTemplateLiteralTypes && nrOfArgs
		? `RequiredParams${nrOfArgs}<${argStrings.map((arg) => `'${arg}'`).join(', ')}>`
		: 'string'
}

// --------------------------------------------------------------------------------------------------------------------

const generateParamsType = (paramTypesToGenerate: number[]) => {
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
const createTranslationArgsType = (parsedTranslations: ParsedResult[], jsDocInfo: JsDocInfos) =>
	`export type LangaugeTranslationArgs = ${wrapObjectType(parsedTranslations, () =>
		parsedTranslations
			.map(
				(translation) =>
					`
	${createTranslationArgssType(translation, jsDocInfo)}`,
			)
			.join(''),
	)}`

const createTranslationArgssType = ({ key, args, types }: ParsedResult, jsDocInfo: JsDocInfos) =>
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

const createFormatterType = (parsedTranslations: ParsedResult[]) => {
	const formatters = getUniqueFormatters(parsedTranslations)

	return `export type LangaugeFormatters = ${wrapObjectType(formatters, () =>
		formatters
			.map(
				([key, types]) =>
					`
	${key}: (value: ${types?.join(' | ')}) => string`,
			)
			.join(''),
	)}`
}

// --------------------------------------------------------------------------------------------------------------------

const getTypes = (
	{ translations, baseLocale, locales, typesTemplateFileName, tsVersion }: GenerateTypesType,
	importType: string,
) => {
	const parsedTranslations = parseTranslations(translations)

	const typeImports = createTypeImportsType(parsedTranslations, typesTemplateFileName, importType)

	const localesType = createLocalesType(locales, baseLocale)

	const translationKeysType = createTranslationKeysType(parsedTranslations)

	const jsDocsInfo = createJsDocsMapping(parsedTranslations)

	const paramTypesToGenerate: number[] = []
	const generateTemplateLiteralTypes = supportsTemplateLiteralTypes(tsVersion)
	const translationType = createTranslationType(
		parsedTranslations,
		jsDocsInfo,
		paramTypesToGenerate,
		generateTemplateLiteralTypes,
	)

	const paramsType = generateTemplateLiteralTypes ? generateParamsType(paramTypesToGenerate) : ''

	const translationArgsType = createTranslationArgsType(parsedTranslations, jsDocsInfo)

	const formattersType = createFormatterType(parsedTranslations)

	return [
		`// This types were auto-generated. Any manual changes will be overwritten.
/* eslint-disable */
${typeImports}
export type LangaugeBaseLocale = '${baseLocale}'

${localesType}

${translationKeysType}

${translationType}

${translationArgsType}

${formattersType}

export type LangaugeFormattersInitializer = (locale: LangaugeLocale) => LangaugeFormatters
${paramsType}`,
		!!typeImports,
	] as [string, boolean]
}

type GenerateTypesType = GeneratorConfigWithDefaultValues & {
	translations: LangaugeBaseTranslation
}

export const generateTypes = async (config: GenerateTypesType, importType: string): Promise<boolean> => {
	const { outputPath, typesFileName } = config

	const [types, hasCustomTypes] = getTypes(config, importType)

	await writeFileIfContainsChanges(outputPath, typesFileName, types)

	return hasCustomTypes
}
