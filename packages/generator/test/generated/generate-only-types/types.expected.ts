// This types were auto-generated. Any manual changes will be overwritten.
/* eslint-disable */

import type { CustomType } from './types-template.actual'

export type BaseLocale = 'en'

export type Locales =
	| 'en'

export type Translation = {
	/**
	 * This is a test {0|someFormatter}
	 * @param {CustomType} 0
	 */
	'TEST': RequiredParams1<'0|someFormatter'>
}

export type TranslationFunctions = {
	/**
	 * This is a test {0|someFormatter}
	 */
	'TEST': (arg0: CustomType) => string
}

export type Formatters = {
	'someFormatter': (value: CustomType) => unknown
}


type Param<P extends string> = `{${P}}`

type Params1<P1 extends string> =
	`${string}${Param<P1>}${string}`

type RequiredParams1<P1 extends string> =
	| Params1<P1>
