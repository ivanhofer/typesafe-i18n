// This types were auto-generated. Any manual changes will be overwritten.
/* eslint-disable */

export type BaseLocale = 'en'

export type Locales =
	| 'en'

export type TranslationKeys =
	| 'PLURAL_BEFORE_KEY'

export type Translation = {
	/**
	 * apple{{s}}: {nrOfApples}
	 * @param {number} nrOfApples
	 */
	'PLURAL_BEFORE_KEY': RequiredParams1<'nrOfApples'>
}

export type TranslationFunctions = {
	/**
	 * apple{{s}}: {nrOfApples}
	 */
	'PLURAL_BEFORE_KEY': (arg: { nrOfApples: number }) => string
}

export type Formatters = {}


type Param<P extends string> = `{${P}}`

type Params1<P1 extends string> =
	`${string}${Param<P1>}${string}`

type RequiredParams1<P1 extends string> =
	| Params1<P1>
