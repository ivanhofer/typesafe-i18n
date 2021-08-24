// This types were auto-generated. Any manual changes will be overwritten.
/* eslint-disable */

import type { LocalizedString } from 'typesafe-i18n'

export type BaseLocale = 'en'

export type Locales =
	| 'de'
	| 'en'

export type Translation = {
	/**
	 * Welcome
	 */
	'WELCOME': string
	/**
	 * Hi {name}
	 * @param {unknown} name
	 */
	'HI': RequiredParams1<'name'>
	/**
	 * Today is {0|weekday}
	 * @param {Date} 0
	 */
	'TODAY': RequiredParams1<'0|weekday'>
}

export type TranslationFunctions = {
	/**
	 * Welcome
	 */
	'WELCOME': () => LocalizedString
	/**
	 * Hi {name}
	 */
	'HI': (arg: { name: unknown }) => LocalizedString
	/**
	 * Today is {0|weekday}
	 */
	'TODAY': (arg0: Date) => LocalizedString
}

export type Formatters = {
	'weekday': (value: Date) => unknown
}


type Param<P extends string> = `{${P}}`

type Params1<P1 extends string> =
	`${string}${Param<P1>}${string}`

type RequiredParams1<P1 extends string> =
	| Params1<P1>
