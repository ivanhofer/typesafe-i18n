// This types were auto-generated. Any manual changes will be overwritten.
/* eslint-disable */

export type BaseLocale = 'en'

export type Locales =
	| 'en'

export type Translation = {
	'some-key': {	
		/**
		 * format {me|custom-formatter}
		 * @param {string} me
		 */
		'other-key': RequiredParams1<'me|custom-formatter'>
	}
	/**
	 * {0|format}
	 * @param {unknown} 0
	 */
	'another-key': RequiredParams1<'0|format'>
}

export type TranslationFunctions = {
	'some-key': {	
		/**
		 * format {me|custom-formatter}
		 */
		'other-key': (arg: { me: string }) => string
	}
	/**
	 * {0|format}
	 */
	'another-key': (arg0: unknown) => string
}

export type Formatters = {
	'custom-formatter': (value: string) => unknown
	'format': (value: unknown) => unknown
}


type Param<P extends string> = `{${P}}`

type Params1<P1 extends string> =
	`${string}${Param<P1>}${string}`

type RequiredParams1<P1 extends string> =
	| Params1<P1>
