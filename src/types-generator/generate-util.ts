import { UTIL_FILE } from '../constants/constants'
import { writeFileIfContainsChanges } from './file-utils'

const getUtil = (baseLocale: string, locales: string[]): string => {
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

import type { LocaleTranslations } from 'langauge'
import type {
	LangaugeTranslation,
	LangaugeTranslationArgs,
	LangaugeFormatters,
	LangaugeLocales,
	LangaugeConfigInitializer
} from './langauge-types'
import { getLangaugeInstance, initLangauge } from 'langauge'
import { initConfig } from './config'
${localesImports}

export const localeTranslations: LocaleTranslations<LangaugeLocales, LangaugeTranslation> = {${localesTranslations}
}

export const getLangauge = (configInitializer: LangaugeConfigInitializer = initConfig) => initLangauge<LangaugeLocales, LangaugeTranslation, LangaugeTranslationArgs, LangaugeFormatters>(localeTranslations, configInitializer)

export const getLangaugeForLocale = (locale: LangaugeLocales, configInitializer: LangaugeConfigInitializer = initConfig) => getLangaugeInstance<LangaugeLocales, LangaugeTranslation, LangaugeTranslationArgs, LangaugeFormatters>(locale, localeTranslations, configInitializer)
`
}

export const generateUtil = async (
	outputPath: string,
	utilFile: string | undefined = UTIL_FILE,
	locales: string[],
	baseLocale: string,
): Promise<void> => {
	const util = getUtil(baseLocale, locales)
	await writeFileIfContainsChanges(outputPath, utilFile, util)
}
