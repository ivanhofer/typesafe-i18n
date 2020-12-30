import { isObject, not } from 'typesafe-utils'
import { DEFAULT_LOCALE } from '../constants/constants'
import { parseRawText } from '../core/parser'
import type { InjectorPart, Part, SingularPluralPart, LangaugeBaseTranslation } from '../types/types'
import { updateTypesIfContainsChanges } from './file-utils'

export type GenerateTypesConfig = {
	outputPath?: string
	outputFile?: string
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

	return [key, args, formatters]
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

const createTranslationArgsType = (translations: [key: string, args: string[]][]) =>
	`export type LangaugeTranslationArgs = ${wrapObjectType(translations, () =>
		translations
			.map(
				(translation) =>
					`
	${createTranslationArgssType(translation)}`,
			)
			.join(''),
	)}`

const createTranslationArgssType = ([key, args]: [key: string, args: string[]]) =>
	`'${key}': (${mapTranslationArgs(args)}) => string`

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
		.flatMap(([_k, _a, f]) => f as string[])
		.reduce((prev, act) => [...prev, act], [] as string[])
	const formatterType = createFormatterType(formatters)

	const translations = result.map(([k, a, _f]) => [k, a as string[]] as [string, string[]])
	const translationArgsType = createTranslationArgsType(translations)

	return `// This types were auto-generated. Any manual changes will be overwritten.
/* eslint-disable */

import type { Config, LangaugeBaseTranslation } from 'langauge'
export type { LangaugeBaseTranslation }

${baseLocaleType}

${localesType}

${translationKeysType}

${translationType}

${translationArgsType}

${formatterType}

export type LangaugeConfig = Config<LangaugeFormatters>
`
}

export const generateTypes = async (
	translationObject: LangaugeBaseTranslation,
	config: GenerateTypesConfig = {} as GenerateTypesConfig,
): Promise<void> => {
	const {
		outputPath = './src/langauge/',
		outputFile = 'langauge-types.ts',
		baseLocale = DEFAULT_LOCALE,
		locales = [],
	} = config

	const types = getTypes(translationObject, baseLocale, locales)

	await updateTypesIfContainsChanges(outputPath, outputFile, types)
}
