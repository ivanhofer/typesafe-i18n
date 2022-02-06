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
	a: {
		/**
		 * {0} apple{{s}}
		 * @param {string | number | boolean} 0
		 */
		APPLES: RequiredParams1<'0'>
	}
	b: {
		/**
		 * {0} apple{{s}}
		 * @param {number} 0
		 */
		APPLES: RequiredParams1<'0'>
	}
	c: {
		/**
		 * {nrOfApples} apple{{s}}
		 * @param {number} nrOfApples
		 */
		APPLES: RequiredParams1<'nrOfApples'>
	}
}

export type TranslationFunctions = {
	a: {
		/**
		 * {0} apple{{s}}
		 */
		APPLES: (arg0: string | number | boolean) => LocalizedString
	}
	b: {
		/**
		 * {0} apple{{s}}
		 */
		APPLES: (arg0: number) => LocalizedString
	}
	c: {
		/**
		 * {nrOfApples} apple{{s}}
		 */
		APPLES: (arg: { nrOfApples: number }) => LocalizedString
	}
}

export type Formatters = {}

type Param<P extends string> = `{${P}}`

type Params1<P1 extends string> =
	`${string}${Param<P1>}${string}`

type RequiredParams1<P1 extends string> =
	| Params1<P1>
