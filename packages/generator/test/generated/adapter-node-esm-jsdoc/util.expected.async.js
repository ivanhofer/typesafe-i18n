// This file was auto-generated by 'typesafe-i18n'. Any manual changes will be overwritten.
// @ts-check
/* eslint-disable */

/**
 * @typedef { import('./types.actual.js').Locales } Locales,
 * @typedef { import('./types.actual.js').Translation } Translation
 */

import { initFormatters } from './formatters-template.actual'

import { loadedFormatters, loadedLocales, locales } from './util.actual'

const localeTranslationLoaders = {
	en: () => import('./en/index.js'),
}

/**
 * @param { Locales } locale
 * @return { Promise<Translation> }
 */
export const loadLocaleAsync = async (locale) => {
	if (loadedLocales[locale]) return

	loadedLocales[locale] = (await (localeTranslationLoaders[locale])()).default
	loadFormatters(locale)
}

export const loadAllLocalesAsync = () => Promise.all(locales.map(loadLocaleAsync))

export const loadFormatters = (locale) =>
	loadedFormatters[locale] = initFormatters(locale)
