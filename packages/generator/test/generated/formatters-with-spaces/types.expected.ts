// This file was auto-generated by 'typesafe-i18n'. Any manual changes will be overwritten.
/* eslint-disable */
import type { BaseTranslation as BaseTranslationType, LocalizedString, RequiredParams } from 'typesafe-i18n'

export type BaseTranslation = BaseTranslationType
export type BaseLocale = 'en'

export type Locales =
	| 'en'

export type Translation = RootTranslation

export type Translations = RootTranslation

type RootTranslation = {
	/**
	 * {0|custom formatter|and another}
	 * @param {unknown} 0
	 */
	FORMATTER: RequiredParams<'0|custom formatter|and another'>
}

export type TranslationFunctions = {
	/**
	 * {0|custom formatter|and another}
	 */
	FORMATTER: (arg0: unknown) => LocalizedString
}

export type Formatters = {
	'and another': (value: unknown) => unknown
	'custom formatter': (value: unknown) => unknown
}
