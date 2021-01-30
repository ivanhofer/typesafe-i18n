import { writeFileIfContainsChanges } from '../file-utils'
import { GeneratorConfigWithDefaultValues } from '../generator'

const getAsyncCode = ({ locales }: GeneratorConfigWithDefaultValues) => {
	const localesTranslationLoaders = locales
		.map(
			(locale) => `
	${locale}: () => import('./${locale}'),`,
		)
		.join('')

	return `
const localeTranslationLoaders = {${localesTranslationLoaders}
}

export const getTranslationForLocale = async (locale: LangaugeLocale) => (await localeTranslationLoaders[locale]()).default as LangaugeTranslation

export const initLangaugeForLocale = (locale: LangaugeLocale) => langaugeLoaderAsync<LangaugeLocale, LangaugeTranslation, LangaugeTranslationArgs, LangaugeFormatters>(locale, getTranslationForLocale, initFormatters)
`
}

const getSyncCode = ({ baseLocale, locales }: GeneratorConfigWithDefaultValues) => {
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
		? `import { langaugeLoaderAsync } from 'langauge'`
		: `import${importType} { LocaleTranslations } from 'langauge'
import { langaugeLoader, langauge, langaugeStringWrapper } from 'langauge'`

	const dynamicCode = lazyLoad ? getAsyncCode(config) : getSyncCode(config)

	const localesEnum = `export const locales = [${locales.map(
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
