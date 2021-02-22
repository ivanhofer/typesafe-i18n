// This types were auto-generated. Any manual changes will be overwritten.
/* eslint-disable */

export type BaseLocale = 'en'

export type Locales =
	| 'de'
	| 'en'
	| 'it'

export type TranslationKeys =
	| 'HI'
	| 'INSTRUCTIONS_LOCALE'
	| 'INSTRUCTIONS_NAME'

export type Translation = {
	/**
	 * Hello {name}!
	 * @param {string} name
	 */
	'HI': RequiredParams1<'name'>
	/**
	 * Please navigate to "http://localhost:3001/:locale", where ":locale" is one of following: "en", "de" or "it" e.g. <a href="http://localhost:3001/en">http://localhost:3001/en</a>
	 */
	'INSTRUCTIONS_LOCALE': string
	/**
	 * Please navigate to "http://localhost:3001/en/:name", where ":name" is your name e.g. <a href="http://localhost:3001/en/John">http://localhost:3001/en/John</a>
	 */
	'INSTRUCTIONS_NAME': string
}

export type TranslationFunctions = {
	/**
	 * Hello {name}!
	 */
	'HI': (arg: { name: string }) => string
	/**
	 * Please navigate to "http://localhost:3001/:locale", where ":locale" is one of following: "en", "de" or "it" e.g. <a href="http://localhost:3001/en">http://localhost:3001/en</a>
	 */
	'INSTRUCTIONS_LOCALE': () => string
	/**
	 * Please navigate to "http://localhost:3001/en/:name", where ":name" is your name e.g. <a href="http://localhost:3001/en/John">http://localhost:3001/en/John</a>
	 */
	'INSTRUCTIONS_NAME': () => string
}

export type Formatters = {}


type Param<P extends string> = `{${P}}`

type Params1<P1 extends string> =
	`${string}${Param<P1>}${string}`

type RequiredParams1<P1 extends string> =
	 | Params1<P1>
