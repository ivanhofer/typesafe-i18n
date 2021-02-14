import type { Locale } from '../../core/core'
import { writeFileIfContainsChanges } from '../file-utils'
import { GeneratorConfigWithDefaultValues } from '../generator'
import { sanitizeLocale } from '../generator-util'

const getLocalesTranslationRowAsync = (locale: Locale): string => {
	const sanitizedLocale = sanitizeLocale(locale)
	const needsEscaping = locale !== sanitizedLocale

	const wrappedLocale = needsEscaping ? `'${locale}'` : locale

	return `
	${wrappedLocale}: () => import('./${locale}'),`
}

const getAsyncCode = ({ locales }: GeneratorConfigWithDefaultValues) => {
	const localesTranslationLoaders = locales.map(getLocalesTranslationRowAsync).join('')

	return `
const localeTranslationLoaders = {${localesTranslationLoaders}
}

export const getTranslationForLocale = async (locale: LangaugeLocale) => (await localeTranslationLoaders[locale]()).default as LangaugeTranslation

export const initLangaugeForLocale = (locale: LangaugeLocale) => langaugeLoaderAsync<LangaugeLocale, LangaugeTranslation, LangaugeTranslationArgs, LangaugeFormatters>(locale, getTranslationForLocale, initFormatters)
`
}

const getLocalesTranslationRowSync = (locale: Locale, baseLocale: string): string => {
	const sanitizedLocale = sanitizeLocale(locale)
	const needsEscaping = locale !== sanitizedLocale

	const postfix =
		locale === baseLocale
			? `: ${sanitizedLocale} as LangaugeTranslation`
			: needsEscaping
				? `: ${sanitizedLocale}`
				: ''

	const wrappedLocale = needsEscaping ? `'${locale}'` : locale

	return `
	${wrappedLocale}${postfix},`
}

const getSyncCode = ({ baseLocale, locales }: GeneratorConfigWithDefaultValues) => {
	const localesImports = locales
		.map(
			(locale) => `
import ${sanitizeLocale(locale)} from './${locale}'`,
		)
		.join('')

	const localesTranslations = locales.map((locale) => getLocalesTranslationRowSync(locale, baseLocale)).join('')
	return `${localesImports}

const localeTranslations: LocaleTranslations<LangaugeLocale, LangaugeTranslation> = {${localesTranslations}
}

export const getTranslationForLocale = (locale: LangaugeLocale) => localeTranslations[locale]

export const initLangaugeForLocale = (locale: LangaugeLocale) => langaugeLoader<LangaugeLocale, LangaugeTranslation, LangaugeTranslationArgs, LangaugeFormatters>(locale, getTranslationForLocale, initFormatters)

export const initLangauge = () => langauge<LangaugeLocale, LangaugeTranslation, LangaugeTranslationArgs, LangaugeFormatters>(getTranslationForLocale, initFormatters)
`
}

const getUtil = (config: GeneratorConfigWithDefaultValues, importType: string): string => {
	const { typesFileName: typesFile, formattersTemplateFileName: formattersTemplatePath, lazyLoad, locales } = config

	const dynamicImports = lazyLoad
		? `import { langaugeLoaderAsync, langaugeStringWrapper } from 'langauge'`
		: `import${importType} { LocaleTranslations } from 'langauge'
import { langaugeLoader, langauge, langaugeStringWrapper } from 'langauge'`

	const dynamicCode = lazyLoad ? getAsyncCode(config) : getSyncCode(config)

	const localesEnum = `export const locales: LangaugeLocale[] = [${locales.map(
		(locale) => `
	'${locale}'`,
	)}
]`

	return `// This types were auto-generated. Any manual changes will be overwritten.
/* eslint-disable */

${dynamicImports}
import${importType} {
	LangaugeTranslation,
	LangaugeTranslationArgs,
	LangaugeFormatters,
	LangaugeLocale,
} from './${typesFile}'
import { initFormatters } from './${formattersTemplatePath}'

${localesEnum}
${dynamicCode}
export const initLangaugeStringWrapper = (locale: LangaugeLocale) => langaugeStringWrapper(locale, initFormatters(locale))
`
}

export const generateUtil = async (config: GeneratorConfigWithDefaultValues, importType: string): Promise<void> => {
	const { outputPath, utilFileName: utilFile } = config

	const util = getUtil(config, importType)
	await writeFileIfContainsChanges(outputPath, utilFile, util)
}
