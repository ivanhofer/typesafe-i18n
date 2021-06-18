// This types were auto-generated. Any manual changes will be overwritten.
/* eslint-disable */

import type { LocalizedString } from 'typesafe-i18n'

export type BaseLocale = 'en'

export type Locales =
	| 'de'
	| 'en'
	| 'it'

export type Translation = {
	/**
	 * choose locale...
	 */
	'CHOOSE_LOCALE': string
	/**
	 * Hello {name}!
	 * @param {string} name
	 */
	'HI': RequiredParams1<'name'>
	/**
	 * Edit <code>src/App.tsx</code> and save to reload.
	 */
	'EDIT_AND_SAVE': string
	/**
	 * Learn React
	 */
	'LEARN_REACT': string
	/**
	 * Your name:
	 */
	'YOUR_NAME': string
	/**
	 * Selected locale:
	 */
	'SELECTED_LOCALE': string
	/**
	 * Today is {date|weekday}
	 * @param {Date} date
	 */
	'TODAY': RequiredParams1<'date|weekday'>
}

export type TranslationFunctions = {
	/**
	 * choose locale...
	 */
	'CHOOSE_LOCALE': () => LocalizedString
	/**
	 * Hello {name}!
	 */
	'HI': (arg: { name: string }) => LocalizedString
	/**
	 * Edit <code>src/App.tsx</code> and save to reload.
	 */
	'EDIT_AND_SAVE': () => LocalizedString
	/**
	 * Learn React
	 */
	'LEARN_REACT': () => LocalizedString
	/**
	 * Your name:
	 */
	'YOUR_NAME': () => LocalizedString
	/**
	 * Selected locale:
	 */
	'SELECTED_LOCALE': () => LocalizedString
	/**
	 * Today is {date|weekday}
	 */
	'TODAY': (arg: { date: Date }) => LocalizedString
}

export type Formatters = {
	'weekday': (value: Date) => unknown
}


type Param<P extends string> = `{${P}}`

type Params1<P1 extends string> =
	`${string}${Param<P1>}${string}`

type RequiredParams1<P1 extends string> =
	| Params1<P1>
