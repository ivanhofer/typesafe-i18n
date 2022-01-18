// This file was auto-generated by 'typesafe-i18n'. Any manual changes will be overwritten.
/* eslint-disable */

import { inject, ref } from 'vue'
import { initI18nVuePlugin } from 'typesafe-i18n/adapters/adapter-vue';
import type { Locales, Translation, TranslationFunctions, Formatters } from './i18n-types'
import { baseLocale, getTranslationForLocale } from './i18n-util'
import { initFormatters } from './formatters'

const { typesafeI18n, i18nPlugin } = initI18nVuePlugin<Locales, Translation, TranslationFunctions, Formatters>(
	inject,
	ref,
	baseLocale,
	getTranslationForLocale,
	initFormatters,
)

export { typesafeI18n, i18nPlugin }