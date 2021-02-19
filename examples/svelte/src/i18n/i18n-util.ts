// This types were auto-generated. Any manual changes will be overwritten.
/* eslint-disable */

import type { LocaleTranslations } from 'typesafe-i18n'
import { i18nLoader, i18n, i18nString } from 'typesafe-i18n'
import type {
	Translation,
	TranslationFunctions,
	Formatters,
	Locales,
} from './i18n-types'
import { initFormatters } from './formatters'

export const locales: Locales[] = [
	'de',
	'en',
	'it'
]

import de from './de'
import en from './en'
import it from './it'

const localeTranslations: LocaleTranslations<Locales, Translation> = {
	de,
	en: en as Translation,
	it,
}

export const getTranslationForLocale = (locale: Locales) => localeTranslations[locale]

export const initI18nForLocale = (locale: Locales) => i18nLoader<Locales, Translation, TranslationFunctions, Formatters>(locale, getTranslationForLocale, initFormatters)

export const initI18n = () => i18n<Locales, Translation, TranslationFunctions, Formatters>(getTranslationForLocale, initFormatters)

export const initI18nString = (locale: Locales = 'en') => i18nString(locale, initFormatters(locale))
