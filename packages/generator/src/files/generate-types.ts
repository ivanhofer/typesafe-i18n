import {
	isArrayNotEmpty,
	isNotUndefined,
	isObject,
	isPropertyTrue,
	isString,
	isTruthy,
	not,
	sortStringASC,
	sortStringPropertyASC,
	uniqueArray,
} from 'typesafe-utils'
import type { GeneratorConfigWithDefaultValues } from '../../../config/src/types'
import { parseRawText } from '../../../parser/src/index'
import type { ArgumentPart } from '../../../parser/src/types'
import { BaseTranslation, isPluralPart, Locale } from '../../../runtime/src/core'
import { partsAsStringWithoutTypes } from '../../../runtime/src/core-utils'
import { REGEX_BRACKETS } from '../constants'
import {
	fileEndingForTypesFile,
	importTypeStatement,
	OVERRIDE_WARNING,
	supportsTemplateLiteralTypes,
} from '../output-handler'
import { Arg, isParsedResultEntry, JsDocInfos, ParsedResult, ParsedResultEntry, Types } from '../types'
import { writeFileIfContainsChanges } from '../utils/file.utils'
import { prettify, wrapObjectKeyIfNeeded } from '../utils/generator.utils'
import type { Logger } from '../utils/logger'
import { getTypeNameForNamespace } from '../utils/namespaces.utils'
import { createTypeImports } from './generate-types/external-type-imports'
import { createFormattersType } from './generate-types/formatters-type'
import { createNamespacesTypes, validateNamespaces } from './generate-types/namespaces'
import { createTranslationFunctionsType } from './generate-types/translation-functions'
import { createTranslationType } from './generate-types/translations'
import { flattenToParsedResultEntry, getNestedKey, wrapUnionType } from './generate-types/_utils'

// TODO: refactor file into multiple smaller files

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

// --------------------------------------------------------------------------------------------------------------------

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

	const externalTypeImports = createTypeImports(parsedTranslations, typesTemplateFileName)

	const localesType = createLocalesType(locales, baseLocale)

	const jsDocsInfo = createJsDocsMapping(parsedTranslations)

	const translationType = createTranslationType(parsedTranslations, jsDocsInfo, 'RootTranslation', namespaces)

	const shouldImportRequiredParamsType =
		supportsTemplateLiteralTypes && doesATranslationContainParams(parsedTranslations)

	const namespacesType = usesNamespaces ? createNamespacesTypes(namespaces) : ''

	const translationArgsType = createTranslationFunctionsType(parsedTranslations, jsDocsInfo)

	const formattersType = createFormattersType(parsedTranslations)

	const type = `${OVERRIDE_WARNING}
${banner}
${importTypeStatement} { BaseTranslation as BaseTranslationType${parsedTranslations.length ? ', LocalizedString' : ''}${
		shouldImportRequiredParamsType ? ', RequiredParams' : ''
	} } from 'typesafe-i18n'
${externalTypeImports}
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

	return [type, !!externalTypeImports] as [string, boolean]
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
