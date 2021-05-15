// This types were auto-generated. Any manual changes will be overwritten.
/* eslint-disable */

export type BaseLocale = 'en'

export type Locales =
	| 'en'

export type TranslationKeys =
	| 'TEST'

export type Translation = {
	/**
	 * Hi {name}, I have {nrOfApples} {{Afpel|Äpfel}}
	 * @param {unknown} name
	 * @param {string | number | boolean} nrOfApples
	 */
	'TEST': RequiredParams2<'name', 'nrOfApples'>
}

export type TranslationFunctions = {
	/**
	 * Hi {name}, I have {nrOfApples} {{Afpel|Äpfel}}
	 */
	'TEST': (arg: { name: unknown, nrOfApples: string | number | boolean }) => string
}

export type Formatters = {}


type Param<P extends string> = `{${P}}`

type Params2<P1 extends string, P2 extends string> =
	`${string}${Param<P1>}${string}${Param<P2>}${string}`

type RequiredParams2<P1 extends string, P2 extends string> =
	| Params2<P1, P2>
	| Params2<P2, P1>
