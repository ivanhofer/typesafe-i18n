// This file was auto-generated by 'typesafe-i18n'. Any manual changes will be overwritten.
// @ts-check
/* eslint-disable */

/**
 * @typedef { import('typesafe-i18n/solid').SolidInit<Locales, Translations, TranslationFunctions> } SolidInit
 * @typedef { import('./types.actual').Formatters } Formatters
 * @typedef { import('./types.actual').Locales } Locales
 * @typedef { import('./types.actual').TranslationFunctions } TranslationFunctions
 * @typedef { import('./types.actual').Translations } Translations
 */

import { initI18nSolid } from 'typesafe-i18n/solid'

import { loadedFormatters, loadedLocales } from './util.actual'

/** @type { SolidInit } */
const { TypesafeI18n, useI18nContext } = initI18nSolid(loadedLocales, loadedFormatters)

export { useI18nContext }

export default TypesafeI18n
