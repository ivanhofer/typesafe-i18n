// This file was auto-generated by 'typesafe-i18n'. Any manual changes will be overwritten.
/* eslint-disable */
import type { BaseTranslation as BaseTranslationType, LocalizedString, RequiredParams } from 'typesafe-i18n'

import type { name } from './types-template.actual'

export type BaseTranslation = BaseTranslationType
export type BaseLocale = 'en'

export type Locales =
	| 'en'

export type Translation = RootTranslation

export type Translations = RootTranslation

type RootTranslation = {
	/**
	 * H​i​ ​{​0​}
	 * @param {name} 0
	 */
	HELLO_ESM: RequiredParams<'0'>
}

export type TranslationFunctions = {
	/**
	 * Hi {0}
	 */
	HELLO_ESM: (arg0: name) => LocalizedString
}

export type Formatters = {}
