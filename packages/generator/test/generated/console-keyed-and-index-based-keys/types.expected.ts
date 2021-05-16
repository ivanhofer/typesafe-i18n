// This types were auto-generated. Any manual changes will be overwritten.
/* eslint-disable */

export type BaseLocale = 'en'

export type Locales =
	| 'en'

export type TranslationKeys =
	| 'TEST'

export type Translation = {
	/**
	 * {hi} {0}
	 * @param {unknown} 0
	 * @param {unknown} hi
	 */
	'TEST': RequiredParams2<'0', 'hi'>
}

export type TranslationFunctions = {
	/**
	 * {hi} {0}
	 */
	'TEST': (arg0: unknown, arghi: unknown) => string
}

export type Formatters = {}


type Param<P extends string> = `{${P}}`

type Params2<P1 extends string, P2 extends string> =
	`${string}${Param<P1>}${string}${Param<P2>}${string}`

type RequiredParams2<P1 extends string, P2 extends string> =
	| Params2<P1, P2>
	| Params2<P2, P1>
