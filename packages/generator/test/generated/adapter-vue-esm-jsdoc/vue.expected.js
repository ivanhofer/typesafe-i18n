// This file was auto-generated by 'typesafe-i18n'. Any manual changes will be overwritten.
// @ts-check
/* eslint-disable */

/**
 * @typedef { import('typesafe-i18n/vue').VuePluginInit<Locales, Translations, TranslationFunctions> } VuePluginInit
 * @typedef { import('./types.actual.js').Formatters } Formatters
 * @typedef { import('./types.actual.js').Locales } Locales
 * @typedef { import('./types.actual.js').TranslationFunctions } TranslationFunctions
 * @typedef { import('./types.actual.js').Translations } Translations
 */

import { inject, ref } from 'vue'
import { initI18nVuePlugin } from 'typesafe-i18n/vue';

import { loadedFormatters, loadedLocales } from './util.actual.js'

/** @type { VuePluginInit } */
const { typesafeI18n, i18nPlugin } = initI18nVuePlugin(inject, ref, loadedLocales, loadedFormatters)

export { typesafeI18n, i18nPlugin }
