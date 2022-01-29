// This file was auto-generated by 'typesafe-i18n'. Any manual changes will be overwritten.
/* tslint:disable */

import { initFormatters } from './formatters-template.actual'
import type { Locales, Translation } from './types.actual'
import { loadedFormatters, loadedLocales, locales } from './util.actual'

import en from './en'

const localeTranslations = {
	en,
}

export const loadLocale = (locale: Locales) => {
	if (loadedLocales[locale]) return

	loadedLocales[locale] = localeTranslations[locale] as Translation
	loadFormatters(locale)
}

export const loadAllLocales = () => locales.forEach(loadLocale)

export const loadFormatters = (locale: Locales) =>
	loadedFormatters[locale] = initFormatters(locale)
