// This types were auto-generated. Any manual changes will be overwritten.
/* eslint-disable */

import type { Result } from './types-template.actual'

export type BaseLocale = 'en'

export type Locales =
	| 'en'

export type TranslationKeys =
	| 'EXTERNAL_TYPE'

export type Translation = {
	/**
	 * The result is {0|calculate}!
	 * @param {Result} 0
	 */
	'EXTERNAL_TYPE': RequiredParams1<'0|calculate'>
}

export type TranslationFunctions = {
	/**
	 * The result is {0|calculate}!
	 */
	'EXTERNAL_TYPE': (arg0: Result) => string
}

export type Formatters = {
	calculate: (value: Result) => unknown
}


type Param<P extends string> = `{${P}}`

type Params1<P1 extends string> =
	`${string}${Param<P1>}${string}`

type RequiredParams1<P1 extends string> =
	| Params1<P1>
