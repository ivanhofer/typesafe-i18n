// This file was auto-generated by 'typesafe-i18n'. Any manual changes will be overwritten.
/* eslint-disable */

import { initI18nReact } from 'typesafe-i18n/adapters/adapter-react'
import type { Locales, Translation, TranslationFunctions, Formatters } from './types.actual.js'
import { baseLocale, getTranslationForLocale } from './util.actual.js'
import { initFormatters } from './formatters-template.actual.js'

const { component: TypesafeI18n, context: I18nContext } = initI18nReact<Locales, Translation, TranslationFunctions, Formatters>(baseLocale, getTranslationForLocale, initFormatters)

export { I18nContext }

export default TypesafeI18n
