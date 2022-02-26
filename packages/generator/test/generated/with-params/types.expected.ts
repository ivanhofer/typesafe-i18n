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
	 * {0} apple{{s}}
	 * @param {string | number | boolean} 0
	 */
	PARAM: RequiredParams<'0'>
	/**
	 * {0} apple{{s}} and {1} banana{{s}}
	 * @param {string | number | boolean} 0
	 * @param {string | number | boolean} 1
	 */
	PARAMS: RequiredParams<'0' | '1'>
}

export type TranslationFunctions = {
	/**
	 * {0} apple{{s}}
	 */
	PARAM: (arg0: string | number | boolean) => LocalizedString
	/**
	 * {0} apple{{s}} and {1} banana{{s}}
	 */
	PARAMS: (arg0: string | number | boolean, arg1: string | number | boolean) => LocalizedString
}

export type Formatters = {}
