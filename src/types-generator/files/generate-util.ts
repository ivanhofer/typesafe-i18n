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

export const getTranslationForLocale = async (locale: Locales) => (await localeTranslationLoaders[locale]()).default as Translation

export const initI18nForLocale = (locale: Locales) => i18nLoaderAsync<Locales, Translation, TranslationFunctions, Formatters>(locale, getTranslationForLocale, initFormatters)
`
}

const getLocalesTranslationRowSync = (locale: Locale, baseLocale: string): string => {
	const sanitizedLocale = sanitizeLocale(locale)
	const needsEscaping = locale !== sanitizedLocale

	const postfix =
		locale === baseLocale ? `: ${sanitizedLocale} as Translation` : needsEscaping ? `: ${sanitizedLocale}` : ''

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

const localeTranslations: LocaleTranslations<Locales, Translation> = {${localesTranslations}
}

export const getTranslationForLocale = (locale: Locales) => localeTranslations[locale]

export const initI18nForLocale = (locale: Locales) => i18nLoader<Locales, Translation, TranslationsFunctions, Formatters>(locale, getTranslationForLocale, initFormatters)

export const initI18n = () => i18n<Locales, Translation, TranslationFunctions, Formatters>(getTranslationForLocale, initFormatters)
`
}

const getUtil = (config: GeneratorConfigWithDefaultValues, importType: string): string => {
	const { typesFileName: typesFile, formattersTemplateFileName: formattersTemplatePath, lazyLoad, locales } = config

	const dynamicImports = lazyLoad
		? `import { i18nLoaderAsync, i18nString } from 'typesafe-i18n'`
		: `import${importType} { TranslationFunctions } from 'typesafe-i18n'
import { i18nLoader, i18n, i18nString } from 'typesafe-i18n'`

	const dynamicCode = lazyLoad ? getAsyncCode(config) : getSyncCode(config)

	const localesEnum = `export const locales: Locales[] = [${locales.map(
		(locale) => `
	'${locale}'`,
	)}
]`

	return `// This types were auto-generated. Any manual changes will be overwritten.
/* eslint-disable */

${dynamicImports}
import${importType} {
	Translation,
	TranslationFunctions,
	Formatters,
	Locales,
} from './${typesFile}'
import { initFormatters } from './${formattersTemplatePath}'

${localesEnum}
${dynamicCode}
export const initI18nString = (locale: Locales) => i18nString(locale, initFormatters(locale))
`
}

export const generateUtil = async (config: GeneratorConfigWithDefaultValues, importType: string): Promise<void> => {
	const { outputPath, utilFileName: utilFile } = config

	const util = getUtil(config, importType)
	await writeFileIfContainsChanges(outputPath, utilFile, util)
}
