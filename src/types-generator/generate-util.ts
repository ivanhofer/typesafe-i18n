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

import type { ConfigWithFormatters, LocaleTranslations } from 'langauge'
import type {
	LangaugeTranslation,
	LangaugeTranslationArgs,
	LangaugeFormatters,
	LangaugeLocales,
} from './langauge-types'
import { getLangaugeInstance, initLangauge } from 'langauge'
${localesImports}

export const localeTranslations: LocaleTranslations<LangaugeLocales, LangaugeTranslation> = {${localesTranslations}
}

export const getLangauge = (config: ConfigWithFormatters<LangaugeFormatters>) => initLangauge<LangaugeLocales, LangaugeTranslation, LangaugeTranslationArgs, LangaugeFormatters>(localeTranslations, config)

export const getLangaugeForLocale = (locale: LangaugeLocales,
	config: ConfigWithFormatters<LangaugeFormatters>,) => getLangaugeInstance<LangaugeLocales, LangaugeTranslation, LangaugeTranslationArgs, LangaugeFormatters>(localeTranslations, locale, config)
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
