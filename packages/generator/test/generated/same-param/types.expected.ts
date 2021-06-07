// This types were auto-generated. Any manual changes will be overwritten.
/* eslint-disable */

export type BaseLocale = 'en'

export type Locales =
	| 'en'

export type Translation = {
	/**
	 * {0} {0} {0}
	 * @param {unknown} 0
	 */
	'SAME_PARAM': RequiredParams3<'0', '0', '0'>
}

export type TranslationFunctions = {
	/**
	 * {0} {0} {0}
	 */
	'SAME_PARAM': (arg0: unknown) => string
}

export type Formatters = {}


type Param<P extends string> = `{${P}}`

type Params3<P1 extends string, P2 extends string, P3 extends string> =
	`${string}${Param<P1>}${string}${Param<P2>}${string}${Param<P3>}${string}`

type RequiredParams3<P1 extends string, P2 extends string, P3 extends string> =
	| Params3<P1, P2, P3>
	| Params3<P1, P3, P2>
	| Params3<P2, P1, P3>
	| Params3<P2, P3, P1>
	| Params3<P3, P1, P2>
	| Params3<P3, P2, P1>
