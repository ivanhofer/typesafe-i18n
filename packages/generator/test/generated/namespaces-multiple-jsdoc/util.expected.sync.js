// This file was auto-generated by 'typesafe-i18n'. Any manual changes will be overwritten.
// @ts-check
/* eslint-disable */

/**
 * @typedef { import('./types.actual').Locales } Locales
 * @typedef { import('./types.actual').Translations } Translations
 */

import { initFormatters } from './formatters-template.actual'

import { loadedFormatters, loadedLocales, locales } from './util.actual'

import en from './en'

import en_test from './en/test'
import en_a from './en/a'
import en_and_another from './en/and-another'
import en_x_y from './en/x y'

const localeTranslations = {
	en: {
		...en,
		test: en_test,
		a: en_a,
		'and-another': en_and_another,
		'x y': en_x_y
	},
}

/**
 * @param { Locales } locale
 * @return { void }
 */
export const loadLocale = (locale) => {
	if (loadedLocales[locale]) return

	loadedLocales[locale] = /** @type { Translations } */ (/** @type { unknown } */ (localeTranslations[locale]))
	loadFormatters(locale)
}

/**
 * @return { void }
 */
export const loadAllLocales = () => locales.forEach(loadLocale)

/**
 * @param { Locales } locale
 * @return { void }
 */
export const loadFormatters = (locale) =>
	void (loadedFormatters[locale] = initFormatters(locale))
