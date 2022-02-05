// This file was auto-generated by 'typesafe-i18n'. Any manual changes will be overwritten.
/* eslint-disable */

import { inject, ref } from 'vue'
import { initI18nVuePlugin } from 'typesafe-i18n/adapters/adapter-vue';
import type { Locales, Translations, TranslationFunctions, Formatters } from './types.actual.js'
import { loadedLocales, loadedFormatters } from './util.actual.js'

const { typesafeI18n, i18nPlugin } = initI18nVuePlugin<Locales, Translations, TranslationFunctions, Formatters>(inject, ref, loadedLocales, loadedFormatters)

export { typesafeI18n, i18nPlugin }
