import {
	filterDuplicates,
	filterDuplicatesByKey,
	isArray,
	isArrayNotEmpty,
	isNotUndefined,
	isObject,
	isPropertyFalsy,
	isPropertyTrue,
	isString,
	isTruthy,
	not,
	sortStringASC,
	sortStringPropertyASC,
	TypeGuard,
	uniqueArray,
} from 'typesafe-utils'
import type { GeneratorConfigWithDefaultValues } from '../../../config/src/types'
import { parseRawText } from '../../../parser/src/index'
import type { ArgumentPart } from '../../../parser/src/types'
import { BaseTranslation, isPluralPart, Locale } from '../../../runtime/src/core'
import { partAsStringWithoutTypes, partsAsStringWithoutTypes } from '../../../runtime/src/core-utils'
import { writeFileIfContainsChanges } from '../file-utils'
import { logger, Logger, prettify, wrapObjectKeyIfNeeded } from '../generator-util'
import {
	fileEndingForTypesFile,
	importTypeStatement,
	OVERRIDE_WARNING,
	supportsTemplateLiteralTypes,
} from '../output-handler'
import { getWrappedString } from './generate-template-locale'

// --------------------------------------------------------------------------------------------------------------------
// types --------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------

type Arg = {
	key: string
	formatters?: string[]
	pluralOnly?: boolean
	optional?: boolean
}

type TypeInformation = {
	types: string[]
	optional?: boolean
}

type Types = {
	[key: string]: TypeInformation
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
	args?: Arg[]
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

// TODO: refactor file into multiple smaller files

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
const PIPE_SEPARATION = ' | '

const mapToString = <T>(items: T[], mappingFunction: (item: T) => string): string => items.map(mappingFunction).join('')

const processNestedParsedResult = (
	items: Exclude<ParsedResult, ParsedResultEntry>,
	mappingFunction: (item: ParsedResult) => string,
): string =>
	NEW_LINE_INDENTED +
	mapToString(
		Object.entries(items),
		([key, parsedResults]) =>
			`${wrapObjectKeyIfNeeded(key)}: {${mapToString(parsedResults, mappingFunction)
				.split(/\r?\n/)
				.map((line) => `	${line}`)
				.join(NEW_LINE)}
	}`,
	)

const getNestedKey = (key: string, parentKeys: string[]) => [...parentKeys, key].join('.')

const flattenToParsedResultEntry = (parsedResults: ParsedResult[]): ParsedResultEntry[] =>
	parsedResults.flatMap((parsedResult) =>
		isParsedResultEntry(parsedResult)
			? parsedResult
			: Object.entries(parsedResult).flatMap(([_, nestedParsedResults]) =>
					flattenToParsedResultEntry(nestedParsedResults),
			  ),
	)

// --------------------------------------------------------------------------------------------------------------------

const parseTranslations = (
	translations: BaseTranslation | BaseTranslation[] | Readonly<BaseTranslation> | Readonly<BaseTranslation[]>,
	logger: Logger,
	parentKeys = [] as string[],
): ParsedResult[] =>
	isObject(translations)
		? Object.entries(translations).map(([key, text]) => {
				if (isString(text)) {
					return parseTranslationEntry([key, text], logger, parentKeys) as ParsedResultEntry
				}
				return { [key]: parseTranslations(text, logger, [...parentKeys, key]) } as ParsedResult
		  })
		: []

const parseTypesFromSwitchCaseStatement = (formatters: string[] | undefined) => {
	if (!formatters?.length) return undefined

	const formatter = formatters[0] as string
	if (!formatter.startsWith('{')) return undefined

	const keys = formatter
		.replace(REGEX_BRACKETS, '')
		.split(',')
		.map((s) => s.split(':'))
		.map(([key]) => key?.trim())
		.sort()

	return keys.map((key) => (key === '*' ? 'string' : `'${key}'`)).join(' | ')
}

const parseTranslationEntry = (
	[key, text]: [string, string],
	logger: Logger,
	parentKeys: string[],
): ParsedResult | null => {
	const parsedParts = parseRawText(text, false)
	const textWithoutTypes = partsAsStringWithoutTypes(parsedParts)

	const parsedObjects = parsedParts.filter(isObject)
	const argumentParts = parsedObjects.filter<ArgumentPart>(not(isPluralPart))
	const pluralParts = parsedObjects.filter(isPluralPart)

	const args: Arg[] = []
	const types: Types = {}

	argumentParts.forEach(({ k, n, i, f }) => {
		args.push({ key: k, formatters: f, optional: n })
		const type = i ?? parseTypesFromSwitchCaseStatement(f)
		types[k] = {
			types: uniqueArray([...(types[k]?.types || []), type]).filter(isNotUndefined),
			optional: types[k]?.optional || n,
		}
	})

	pluralParts.forEach(({ k }) => {
		if (!types[k]?.types.length) {
			// if key has no types => add types that are valid for a PluralPart
			types[k] = { types: ['string', 'number', 'boolean'] }
			if (!args.find(({ key }) => key === k)) {
				// if only pluralPart exists => add it as argument
				args.push({ key: k, formatters: [], pluralOnly: true })
			}
		}
	})

	// add 'unknown' if argument has no type
	Object.keys(types).forEach((key) => {
		if (!types[key]?.types.length) {
			types[key] = { types: ['unknown'], optional: types[key]?.optional }
		}
	})

	args.sort(sortStringPropertyASC('key'))

	const isValid = validateTranslation(key, types, logger)

	if (!isValid) return null

	return { key, text, textWithoutTypes, args, types, parentKeys }
}

const validateTranslation = (key: string, types: Types, logger: Logger): boolean => {
	const base = `translation '${key}' =>`

	if (key.includes('.')) {
		logger.error(
			`${base} key can't contain the '.' character. Please remove it. If you want to nest keys, you should look at https://github.com/ivanhofer/typesafe-i18n#nested-translations`,
		)
		return false
	}

	const argKeys = Object.keys(types).sort(sortStringASC)
	if (isArrayNotEmpty(argKeys) && !isNaN(+argKeys[0])) {
		let expectedKey = '0'
		for (const argKey of argKeys) {
			if (argKey !== expectedKey) {
				const info = isNaN(+argKey)
					? `You can't mix keyed and index-based arguments.`
					: `Make sure to not skip an index for your arguments.`

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
	'LocalizedString',
].flatMap((t: string) => [t, `${t}[]`, `Array<${t}>`])

const isParsedResultEntry = <T extends ParsedResult>(entry: T): entry is TypeGuard<ParsedResultEntry, T> =>
	isArray(entry.parentKeys) && isObject(entry.types)

const extractTypes = (parsedTranslations: ParsedResult[]): string[] =>
	parsedTranslations.flatMap((parsedTranslation) => {
		if (isParsedResultEntry(parsedTranslation)) {
			return Object.values(parsedTranslation.types)
				.map(({ types }) => types)
				.flat()
		}

		return extractTypes(Object.values(parsedTranslation).flat())
	})

const createTypeImports = (parsedTranslations: ParsedResult[], typesTemplatePath: string): string => {
	const types = extractTypes(parsedTranslations).filter(filterDuplicates)

	const externalTypes = Array.from(types)
		.filter(
			(type) => !BASE_TYPES.includes(type) && !(type.includes('|') || type.startsWith("'") || type.endsWith("'")),
		)
		.sort(sortStringASC)

	if (!externalTypes.length) return ''

	return `
${importTypeStatement} { ${externalTypes.join(COMMA_SEPARATION)} } from './${typesTemplatePath.replace('.ts', '')}'
`
}

// --------------------------------------------------------------------------------------------------------------------

const createJsDocsMapping = (parsedTranslations: ParsedResult[]) => {
	const map = {} as JsDocInfos

	flattenToParsedResultEntry(parsedTranslations).forEach((parsedResultEntry) => {
		const { key, textWithoutTypes, types, args = [], parentKeys } = parsedResultEntry
		const nestedKey = getNestedKey(key, parentKeys)
		map[nestedKey] = {
			text: textWithoutTypes,
			types,
			pluralOnlyArgs: args.filter(isPropertyTrue('pluralOnly')).map(({ key }) => key),
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

	return text?.length + renderedTypes.length
		? `/**
	 * ${text}${renderedTypes}
	 */
	`
		: ''
}

const createJsDocsParamString = ([paramName, { types, optional }]: [string, TypeInformation]) => `
	 * @param {${types.join(' | ')}} ${optional ? `[${paramName}]` : paramName}`

// --------------------------------------------------------------------------------------------------------------------

export const getTypeNameForNamespace = (namespace: string) => {
	const transformedNamespace = namespace
		.split(/[\s_-]/g)
		.map((part) => `${part.substring(0, 1).toUpperCase()}${part.substring(1)}`)
		.join('')

	return `Namespace${transformedNamespace}Translation`
}

const createTranslationType = (
	parsedTranslations: ParsedResult[],
	jsDocInfo: JsDocInfos,
	nameOfType: string,
	namespaces: string[] = [],
): string => {
	const parsedTranslationsWithoutNamespaces = parsedTranslations.filter((parsedResult) => {
		const keys = Object.keys(parsedResult)
		return keys.length > 1 || !namespaces.includes(keys[0] as string)
	})

	const translationType = `type ${nameOfType} = ${wrapObjectType(parsedTranslationsWithoutNamespaces, () =>
		mapToString(parsedTranslationsWithoutNamespaces, (parsedResultEntry) =>
			createTranslationTypeEntry(parsedResultEntry, jsDocInfo),
		),
	)}`

	const parsedNamespaceTranslations = parsedTranslations.filter((parsedResult) => {
		const keys = Object.keys(parsedResult)
		return keys.length === 1 && namespaces.includes(keys[0] as string)
	})

	const namespaceTranslationsTypes = parsedNamespaceTranslations
		.map((value) => {
			return Object.entries(value).flat() as [string, ParsedResult[]]
		})
		.map(([namespace, parsedTranslations]) => {
			if (!isArray(parsedTranslations)) return ''

			return (
				'export ' +
				createTranslationType(
					isArray(parsedTranslations) ? parsedTranslations : [parsedTranslations],
					jsDocInfo,
					getTypeNameForNamespace(namespace),
				)
			)
		})

	return `${translationType}

${namespaceTranslationsTypes.join(NEW_LINE + NEW_LINE)}`
}

const validateNamespaces = (translations: BaseTranslation | BaseTranslation[], namespaces: string[]) => {
	if (!namespaces.length) return

	namespaces.forEach((namespace) => {
		if (isString((translations as Record<string, unknown>)[namespace])) {
			logger.error(`namespace '${namespace}' cant be a \`string\`. Must be an \`object\` or \`Array\`.`)
		}
	})
}

const createNamespacesTypes = (namespaces: string[]) => `
export type Namespaces =${wrapUnionType(namespaces)}

type DisallowNamespaces = {${namespaces
	.map(
		(namespace) => `
	/**
	 * reserved for '${namespace}'-namespace\\
	 * you need to use the \`./${namespace}/index.ts\` file instead
	 */
	${wrapObjectKeyIfNeeded(
		namespace,
	)}?: "[typesafe-i18n] reserved for '${namespace}'-namespace. You need to use the \`./${namespace}/index.ts\` file instead."`,
	)
	.join(NEW_LINE)}
}`

const createTranslationTypeEntry = (resultEntry: ParsedResult, jsDocInfo: JsDocInfos): string => {
	if (isParsedResultEntry(resultEntry)) {
		const { key, args, parentKeys } = resultEntry

		const nestedKey = getNestedKey(key, parentKeys)
		const jsDocString = createJsDocsString(jsDocInfo[nestedKey] as JsDocInfo, true, false)
		const translationType = generateTranslationType(args)

		return `
	${jsDocString}${wrapObjectKeyIfNeeded(key)}: ${translationType}`
	}

	return processNestedParsedResult(resultEntry, (parsedResultEntry) =>
		createTranslationTypeEntry(parsedResultEntry, jsDocInfo),
	)
}

const REGEX_BRACKETS = /(^{)|(}$)/g

const getFormatterType = (formatter: string) => {
	if (!formatter.startsWith('{')) return formatter

	const cases = formatter
		.replace(REGEX_BRACKETS, '')
		.split(',')
		.map((part) => part.split(':'))
		.map(([key]) => [key, `\${string}`])
		.map((part) => part.join(':'))
		.join(',')

	return `{${cases}}`
}

const generateTranslationType = (args: Arg[] = []) => {
	const argStrings = args
		.filter(isPropertyFalsy('pluralOnly'))
		.map(({ key, optional, formatters }) =>
			partAsStringWithoutTypes({ k: key, n: optional, f: formatters?.map(getFormatterType) }).replace(
				REGEX_BRACKETS,
				'',
			),
		)

	return supportsTemplateLiteralTypes && argStrings.length
		? `RequiredParams<${argStrings.map((arg) => getWrappedString(arg, true)).join(PIPE_SEPARATION)}>`
		: 'string'
}

// --------------------------------------------------------------------------------------------------------------------

const createTranslationsArgsType = (parsedTranslations: ParsedResult[], jsDocInfo: JsDocInfos) =>
	`export type TranslationFunctions = ${wrapObjectType(parsedTranslations, () =>
		mapToString(parsedTranslations, (translation) => createTranslationArgsType(translation, jsDocInfo)),
	)}`

const createTranslationArgsType = (parsedResult: ParsedResult, jsDocInfo: JsDocInfos): string => {
	if (isParsedResultEntry(parsedResult)) {
		const { key, args, types, parentKeys } = parsedResult
		const nestedKey = getNestedKey(key, parentKeys)
		const jsDocString = createJsDocsString(jsDocInfo[nestedKey] as JsDocInfo)

		return `
	${jsDocString}${wrapObjectKeyIfNeeded(key)}: (${mapTranslationArgs(args, types)}) => LocalizedString`
	}

	return processNestedParsedResult(parsedResult, (parsedResultEntry) =>
		createTranslationArgsType(parsedResultEntry, jsDocInfo),
	)
}

const mapTranslationArgs = (args: Arg[] = [], types: Types) => {
	if (!args.length) return ''

	const uniqueArgs = args.filter(filterDuplicatesByKey('key'))
	const arg = uniqueArgs[0]?.key as string

	const isKeyed = isNaN(+arg)
	const prefix = (isKeyed && 'arg: { ') || ''
	const postfix = (isKeyed && ' }') || ''
	const argPrefix = (!isKeyed && 'arg') || ''

	return (
		prefix +
		uniqueArgs
			.map(({ key, optional }) => `${argPrefix}${key}${optional ? '?' : ''}: ${types[key]?.types.join(' | ')}`)
			.join(COMMA_SEPARATION) +
		postfix
	)
}

// --------------------------------------------------------------------------------------------------------------------

const getUniqueFormatters = (parsedTranslations: ParsedResult[]): [string, string[]][] => {
	const map = {} as { [key: string]: string[] }

	flattenToParsedResultEntry(parsedTranslations).forEach((parsedResult) => {
		const { types, args = [] } = parsedResult
		args.forEach(({ key, formatters }) =>
			(formatters || [])
				.filter((formatter) => !formatter.startsWith('{'))
				.forEach((formatter) => (map[formatter] = [...(map[formatter] || []), ...(types[key]?.types || [])])),
		)
	})

	return Object.entries(map).sort(sortStringPropertyASC('0'))
}

const createFormattersType = (parsedTranslations: ParsedResult[]) => {
	const formatters = getUniqueFormatters(parsedTranslations)

	return `export type Formatters = ${wrapObjectType(formatters, () =>
		mapToString(
			formatters,
			([key, types]) =>
				`
	${wrapObjectKeyIfNeeded(key)}: (value: ${uniqueArray(types).join(' | ')}) => unknown`,
		),
	)}`
}

// --------------------------------------------------------------------------------------------------------------------

const doesATranslationContainParams = (p: ParsedResult[]): boolean =>
	p.some((parsedResult) =>
		isParsedResultEntry(parsedResult)
			? parsedResult.args?.some(({ pluralOnly }) => pluralOnly !== true)
			: doesATranslationContainParams(Object.values(parsedResult).flat()),
	)

const getTypes = (
	{ translations, baseLocale, locales, typesTemplateFileName, banner, namespaces }: GenerateTypesType,
	logger: Logger,
) => {
	const usesNamespaces = !!namespaces.length
	validateNamespaces(translations, namespaces)

	const parsedTranslations = parseTranslations(translations, logger).filter(isTruthy)

	const typeImports = createTypeImports(parsedTranslations, typesTemplateFileName)

	const localesType = createLocalesType(locales, baseLocale)

	const jsDocsInfo = createJsDocsMapping(parsedTranslations)

	const translationType = createTranslationType(parsedTranslations, jsDocsInfo, 'RootTranslation', namespaces)

	const shouldImportRequiredParamsType =
		supportsTemplateLiteralTypes && doesATranslationContainParams(parsedTranslations)

	const namespacesType = usesNamespaces ? createNamespacesTypes(namespaces) : ''

	const translationArgsType = createTranslationsArgsType(parsedTranslations, jsDocsInfo)

	const formattersType = createFormattersType(parsedTranslations)

	const type = `${OVERRIDE_WARNING}
${banner}
${importTypeStatement} { BaseTranslation as BaseTranslationType${parsedTranslations.length ? ', LocalizedString' : ''}${
		shouldImportRequiredParamsType ? ', RequiredParams' : ''
	} } from 'typesafe-i18n'
${typeImports}
export type BaseTranslation = BaseTranslationType${usesNamespaces ? ' & DisallowNamespaces' : ''}
export type BaseLocale = '${baseLocale}'

${localesType}

export type Translation = RootTranslation${usesNamespaces ? ' & DisallowNamespaces' : ''}

export type Translations = RootTranslation${
		usesNamespaces
			? ` &
{${namespaces.map(
					(namespace) => `
	${wrapObjectKeyIfNeeded(namespace)}: ${getTypeNameForNamespace(namespace)}`,
			  )}
}
`
			: ''
	}

${translationType}

${namespacesType}

${translationArgsType}

${formattersType}
`

	return [type, !!typeImports] as [string, boolean]
}

// --------------------------------------------------------------------------------------------------------------------

export type GenerateTypesType = GeneratorConfigWithDefaultValues & {
	translations: BaseTranslation | BaseTranslation[]
	locales: Locale[]
	namespaces: string[]
}

export const generateTypes = async (config: GenerateTypesType, logger: Logger): Promise<boolean> => {
	const { outputPath, typesFileName } = config

	const [types, hasCustomTypes] = getTypes(config, logger)

	await writeFileIfContainsChanges(outputPath, `${typesFileName}${fileEndingForTypesFile}`, prettify(types))

	return hasCustomTypes
}
