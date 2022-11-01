// This file was auto-generated by 'typesafe-i18n'. Any manual changes will be overwritten.
// @ts-check
/* eslint-disable */

/**
 * @typedef { import('./types.actual.js').Locales } Locales
 * @typedef { import('./types.actual.js').Translations } Translations
 */

import { initFormatters } from '././formatters-template.actual.js'

import { loadedFormatters, loadedLocales, locales } from '././util.actual.js'

import en from './en/index.js'

const localeTranslations = {
	en,
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
