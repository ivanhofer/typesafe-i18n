import { writeFileIfContainsChanges } from './file-utils'
import { GeneratorConfigWithDefaultValues } from './generator'

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

export const getTranslationFromLocale = async (locale: LangaugeLocale) => (await localeTranslationLoaders[locale]()).default as LangaugeTranslation

export const getLangaugeForLocale = (locale: LangaugeLocale) => getLangaugeInstanceAsync<LangaugeLocale, LangaugeTranslation, LangaugeTranslationArgs, LangaugeFormatters>(locale, getTranslationFromLocale, initFormatters)
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

export const getTranslationFromLocale = (locale: LangaugeLocale) => localeTranslations[locale]

export const getLangauge = () => initLangauge<LangaugeLocale, LangaugeTranslation, LangaugeTranslationArgs, LangaugeFormatters>(getTranslationFromLocale, initFormatters)

export const getLangaugeForLocale = (locale: LangaugeLocale) => getLangaugeInstance<LangaugeLocale, LangaugeTranslation, LangaugeTranslationArgs, LangaugeFormatters>(locale, getTranslationFromLocale, initFormatters)
`
}

const getUtil = (config: GeneratorConfigWithDefaultValues): string => {
	const { typesFileName: typesFile, formattersTemplateFileName: formattersTemplatePath, lazyLoad } = config

	const dynamicImports = lazyLoad
		? `import { getLangaugeInstanceAsync } from 'langauge'`
		: `import type { LocaleTranslations } from 'langauge'
import { getLangaugeInstance, initLangauge } from 'langauge'`

	const dynamicCode = lazyLoad ? getAsyncCode(config) : getSyncCode(config)

	return `// This types were auto-generated. Any manual changes will be overwritten.
/* eslint-disable */

${dynamicImports}
import type {
	LangaugeTranslation,
	LangaugeTranslationArgs,
	LangaugeFormatters,
	LangaugeLocale,
} from './${typesFile}'
import { initFormatters } from './${formattersTemplatePath}'
${dynamicCode}`
}

export const generateUtil = async (config: GeneratorConfigWithDefaultValues): Promise<void> => {
	const { outputPath, utilFileName: utilFile } = config

	const util = getUtil(config)
	await writeFileIfContainsChanges(outputPath, utilFile, util)
}
