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
	 * Hi {0}
	 * @param {string} 0
	 */
	HELLO_VUE: RequiredParams<'0'>
}

export type TranslationFunctions = {
	/**
	 * Hi {0}
	 */
	HELLO_VUE: (arg0: string) => LocalizedString
}

export type Formatters = {}
