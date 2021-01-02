import { isObject, not } from 'typesafe-utils'
import { DEFAULT_LOCALE } from '../constants/constants'
import { parseRawText } from '../core/parser'
import type { InjectorPart, Part, SingularPluralPart, LangaugeBaseTranslation } from '../types/types'
import { writeFileIfContainsChanges } from './file-utils'

export type GenerateTypesConfig = {
	outputPath?: string
	typesFile?: string
	utilFile?: string
	baseLocale?: string
	locales?: string[]
}

type IsSingularPluralPart<T> = T extends SingularPluralPart ? T : never

const isSingularPluralPart = <T extends Part>(part: T): part is IsSingularPluralPart<T> =>
	!!(<SingularPluralPart>part).p

const parseTanslationObject = ([key, text]: [string, string]) => {
	const args: string[] = []
	const formatters: string[] = []

	parseRawText(text, false)
		.filter(isObject)
		.filter(not<InjectorPart>(isSingularPluralPart))
		.forEach((injectorPart) => {
			const { k, f } = injectorPart
			k && args.push(k)
			f && formatters.push(...f)
		})

	return [key, text, args, formatters]
}

const wrapObjectType = (array: unknown[], callback: () => string) =>
	!array.length
		? '{}'
		: `{${callback()}
}`

const wrapEnumType = (array: unknown[], callback: () => string) => (!array.length ? ' never' : `${callback()}`)

const createEnumType = (locales: string[]) =>
	locales
		.map(
			(locale) => `
	| '${locale}'`,
		)
		.join('')

const createLocalesType = (locales: string[]) =>
	`export type LangaugeLocales =${wrapEnumType(locales, () => createEnumType(locales))}`

const createTranslationKeysType = (keys: string[]) =>
	`export type LangaugeTranslationKeys =${wrapEnumType(keys, () => createEnumType(keys))}`

const createTranslationType = (keys: string[]) =>
	`export type LangaugeTranslation = ${wrapObjectType(keys, () =>
		keys
			.map(
				(key) =>
					`
	'${key}': string`,
			)
			.join(''),
	)}`

const createFormatterType = (formatterKeys: string[]) =>
	`export type LangaugeFormatters = ${wrapObjectType(formatterKeys, () =>
		formatterKeys
			.map(
				(key) =>
					`
	${key}: (value: any) => string`,
			)
			.join(''),
	)}`

const createTranslationArgsType = (translations: [key: string, text: string, args: string[]][]) =>
	`export type LangaugeTranslationArgs = ${wrapObjectType(translations, () =>
		translations
			.map(
				(translation) =>
					`
	${createTranslationArgssType(translation)}`,
			)
			.join(''),
	)}`

const createTranslationArgssType = ([key, text, args]: [key: string, text: string, args: string[]]) =>
	`/**
	 * ${text}
	 */
	'${key}': (${mapTranslationArgs(args)}) => string`

const mapTranslationArgs = (args: string[]) => {
	if (!args.length) {
		return ''
	}

	const arg = args[0] as string

	const isKeyed = isNaN(+arg)
	const prefix = (isKeyed && 'arg: { ') || ''
	const postfix = (isKeyed && ' }') || ''
	const argPrefix = (!isKeyed && 'arg') || ''

	return prefix + args.map((arg) => `${argPrefix}${arg}: unknown`).join(', ') + postfix
}

const getTypes = (translationObject: LangaugeBaseTranslation, baseLocale: string, locales: string[]) => {
	const result = (isObject(translationObject) && Object.entries(translationObject).map(parseTanslationObject)) || []

	const baseLocaleType = `export type LangaugeBaseLocale = '${baseLocale}'`

	const localesType = createLocalesType(locales?.length ? locales : [baseLocale])

	const keys = result.map(([k]) => k as string)

	const translationKeysType = createTranslationKeysType(keys)

	const translationType = createTranslationType(keys)

	const formatters = result
		.flatMap(([_k, _t, _a, f]) => f as string[])
		.reduce((prev, act) => [...prev, act], [] as string[])
	const formatterType = createFormatterType(formatters)

	const translations = result.map(([k, t, a, _f]) => [k, t, a as string[]] as [string, string, string[]])
	const translationArgsType = createTranslationArgsType(translations)

	return `// This types were auto-generated. Any manual changes will be overwritten.
/* eslint-disable */

import type { Config } from 'langauge'

${baseLocaleType}

${localesType}

${translationKeysType}

${translationType}

${translationArgsType}

${formatterType}

export type LangaugeConfig = Config<LangaugeFormatters>
`
}

export const getUtil = (baseLocale: string, locales: string[]): string => {
	baseLocale
	const localesImports = locales
		.map(
			(locale) => `
import ${locale.replace('-', '_')} from './${locale}'`,
		)
		.join('')

	const localesTranslations = locales
		.map(
			(locale) => `
	${locale}${locale === baseLocale ? `: ${locale} as LangaugeTranslation` : ''},`,
		)
		.join('')

	return `// This types were auto-generated. Any manual changes will be overwritten.
/* eslint-disable */

import type { ConfigWithFormatters, LocaleTranslations } from 'langauge'
import type {
	LangaugeTranslation,
	LangaugeTranslationArgs,
	LangaugeFormatters,
	LangaugeLocales,
} from './langauge-types'
import { getLangaugeInstance, initLangauge } from 'langauge'
${localesImports}

const localeTranlslations: LocaleTranslations<LangaugeLocales, LangaugeTranslation> = {${localesTranslations}
}

export const getLangauge = (config: ConfigWithFormatters<LangaugeFormatters>) => initLangauge<LangaugeLocales, LangaugeTranslation, LangaugeTranslationArgs, LangaugeFormatters>(localeTranlslations, config)

export const getLangaugeForLocale = (locale: LangaugeLocales,
	config: ConfigWithFormatters<LangaugeFormatters>,) => getLangaugeInstance<LangaugeLocales, LangaugeTranslation, LangaugeTranslationArgs, LangaugeFormatters>(localeTranlslations, locale, config)
`
}

export const generateTypes = async (
	translationObject: LangaugeBaseTranslation,
	config: GenerateTypesConfig = {} as GenerateTypesConfig,
): Promise<void> => {
	const {
		outputPath = './src/langauge/',
		typesFile = 'langauge-types.ts',
		utilFile = 'langauge-util.ts',
		baseLocale = DEFAULT_LOCALE,
		locales = [],
	} = config

	const types = getTypes(translationObject, baseLocale, locales)
	await writeFileIfContainsChanges(outputPath, typesFile, types)

	const util = getUtil(baseLocale, locales)
	await writeFileIfContainsChanges(outputPath, utilFile, util)
}
