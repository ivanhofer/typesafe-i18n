import { writeFileIfContainsChanges } from './file-utils'
import { GeneratorConfigWithDefaultValues } from './generator'

const getUtil = ({
	baseLocale,
	locales,
	typesFileName: typesFile,
	formattersTemplateFileName: formattersTemplatePath,
}: GeneratorConfigWithDefaultValues): string => {
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

	const localesTranslationLoaders = locales
		.map(
			(locale) => `
	${locale}: () => import('./${locale}'),`,
		)
		.join('')

	return `// This types were auto-generated. Any manual changes will be overwritten.
/* eslint-disable */

import type { LocaleTranslations } from 'langauge'
import { getLangaugeInstance, initLangauge } from 'langauge'
import type {
	LangaugeTranslation,
	LangaugeTranslationArgs,
	LangaugeFormatters,
	LangaugeLocale,
} from './${typesFile}'
import { initFormatters } from './${formattersTemplatePath}'
${localesImports}

export const localeTranslations: LocaleTranslations<LangaugeLocale, LangaugeTranslation> = {${localesTranslations}
}

export const getLocaleTranslations = (locale: LangaugeLocale) => localeTranslations[locale]

export const localeTranslationLoaders = {${localesTranslationLoaders}
}

export const loadLocaleTranslations = async (locale: LangaugeLocale) => (await localeTranslationLoaders[locale]()).default as LangaugeTranslation

export const getLangauge = () => initLangauge<LangaugeLocale, LangaugeTranslation, LangaugeTranslationArgs, LangaugeFormatters>(localeTranslations, initFormatters)

export const getLangaugeForLocale = (locale: LangaugeLocale) => getLangaugeInstance<LangaugeLocale, LangaugeTranslation, LangaugeTranslationArgs, LangaugeFormatters>(locale, localeTranslations, initFormatters)
`
}

export const generateUtil = async (config: GeneratorConfigWithDefaultValues): Promise<void> => {
	const { outputPath, utilFileName: utilFile } = config

	const util = getUtil(config)
	await writeFileIfContainsChanges(outputPath, utilFile, util)
}
