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
	 * Click on the button: <button>{buttonText}</button>
	 * @param {LocalizedString} buttonText
	 */
	'localized': RequiredParams1<'buttonText'>
}

export type TranslationFunctions = {
	/**
	 * Click on the button: <button>{buttonText}</button>
	 */
	'localized': (arg: { buttonText: LocalizedString }) => LocalizedString
}

export type Formatters = {}

type Param<P extends string> = `{${P}}`

type Params1<P1 extends string> =
	`${string}${Param<P1>}${string}`

type RequiredParams1<P1 extends string> =
	| Params1<P1>
