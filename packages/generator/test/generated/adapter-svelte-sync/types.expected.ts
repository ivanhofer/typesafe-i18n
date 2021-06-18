// This types were auto-generated. Any manual changes will be overwritten.
/* eslint-disable */

import type { LocalizedString } from 'typesafe-i18n'

export type BaseLocale = 'en'

export type Locales =
	| 'en'

export type Translation = {
	/**
	 * Hi {0}
	 * @param {unknown} 0
	 */
	'HELLO_SVELTE': RequiredParams1<'0'>
}

export type TranslationFunctions = {
	/**
	 * Hi {0}
	 */
	'HELLO_SVELTE': (arg0: unknown) => LocalizedString
}

export type Formatters = {}


type Param<P extends string> = `{${P}}`

type Params1<P1 extends string> =
	`${string}${Param<P1>}${string}`

type RequiredParams1<P1 extends string> =
	| Params1<P1>
