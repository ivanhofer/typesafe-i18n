// This file was auto-generated by 'typesafe-i18n'. Any manual changes will be overwritten.
/* eslint-disable */

import { initFormatters } from './formatters'
import type { Locales, Translations, Namespaces } from './i18n-types'
import { loadedFormatters, loadedLocales, locales } from './i18n-util'

const localeTranslationLoaders = {
	de: () => import('./de'),
	en: () => import('./en'),
}

const localeNamespaceLoaders = {
	de: {
		'my-namespace': () => import('./de/my-namespace')
	},
	en: {
		'my-namespace': () => import('./en/my-namespace')
	}
}

export const loadLocaleAsync = async (locale: Locales) => {
	if (loadedLocales[locale]) return

	loadedLocales[locale] = (await localeTranslationLoaders[locale]()).default as unknown as Translations
	loadFormatters(locale)
}

export const loadAllLocalesAsync = () => Promise.all(locales.map(loadLocaleAsync))

export const loadFormatters = (locale: Locales) => {
	loadedFormatters[locale] = initFormatters(locale)
}

export const loadNamespaceAsync = async <Namespace extends Namespaces>(locale: Locales, namespace: Namespace) => {
	if (!loadedLocales[locale]) loadedLocales[locale] = {} as Translations
	loadedLocales[locale][namespace] = (await (localeNamespaceLoaders[locale][namespace])()).default as Translations[Namespace]
}
