// This file was auto-generated by 'typesafe-i18n'. Any manual changes will be overwritten.
/* eslint-disable */

import { getI18nSvelteStore } from 'typesafe-i18n/adapters/adapter-svelte';
import type { Locales, Translation, TranslationFunctions, Formatters } from './types.actual.js'
import { getTranslationForLocale } from './util.actual.js'
import { initFormatters } from './formatters-template.actual.js'

const { initI18n: init, setLocale, isLoadingLocale, locale, LL } = getI18nSvelteStore<Locales, Translation, TranslationFunctions, Formatters>()

const initI18n = (locale: Locales = 'en') => init(locale, getTranslationForLocale, initFormatters)

export { initI18n, setLocale, isLoadingLocale, locale, LL }

export default LL
