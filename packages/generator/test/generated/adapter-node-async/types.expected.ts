// This types were auto-generated. Any manual changes will be overwritten.
/* eslint-disable */

import type { name } from './types-template.actual'

export type BaseLocale = 'en'

export type Locales =
	| 'en'

export type Translation = {
	/**
	 * Hi {0}
	 * @param {name} 0
	 */
	'HELLO_NODE': RequiredParams1<'0'>
}

export type TranslationFunctions = {
	/**
	 * Hi {0}
	 */
	'HELLO_NODE': (arg0: name) => string
}

export type Formatters = {}


type Param<P extends string> = `{${P}}`

type Params1<P1 extends string> =
	`${string}${Param<P1>}${string}`

type RequiredParams1<P1 extends string> =
	| Params1<P1>
