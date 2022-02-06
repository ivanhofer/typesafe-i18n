// This file was auto-generated by 'typesafe-i18n'. Any manual changes will be overwritten.
/* eslint-disable */
import type { BaseTranslation as BaseTranslationType, LocalizedString } from 'typesafe-i18n'

export type BaseTranslation = BaseTranslationType
export type BaseLocale = 'en'

export type Locales =
	| 'en'

export type Translation = RootTranslation

export type Translations = RootTranslation

type RootTranslation = {
	/**
	 * {0|calculate}!
	 * @param {number} 0
	 */
	A: RequiredParams1<'0|calculate'>
	/**
	 * {0|calculate}
	 * @param {Date} 0
	 */
	B: RequiredParams1<'0|calculate'>
}

export type TranslationFunctions = {
	/**
	 * {0|calculate}!
	 */
	A: (arg0: number) => LocalizedString
	/**
	 * {0|calculate}
	 */
	B: (arg0: Date) => LocalizedString
}

export type Formatters = {
	calculate: (value: number | Date) => unknown
}

type Param<P extends string> = `{${P}}`

type Params1<P1 extends string> =
	`${string}${Param<P1>}${string}`

type RequiredParams1<P1 extends string> =
	| Params1<P1>
