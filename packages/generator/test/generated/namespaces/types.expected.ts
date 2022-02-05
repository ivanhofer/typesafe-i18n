// This file was auto-generated by 'typesafe-i18n'. Any manual changes will be overwritten.
/* eslint-disable */
import type { BaseTranslation as BaseTranslationType, LocalizedString } from 'typesafe-i18n'

export type BaseTranslation = BaseTranslationType & DisallowNamespaces
export type BaseLocale = 'en'

export type Locales =
	| 'en'

export type Translation = RootTranslation & DisallowNamespaces

export type Translations = RootTranslation &
{
	test: NamespaceTestTranslation
}

type RootTranslation = {
	/**
	 * some text
	 */
	'wow': string
}

export type NamespaceTestTranslation = {
	/**
	 * hello
	 */
	'hi': string
}

export type Namespaces =
	| 'test'

type DisallowNamespaces = {
	/**
	 * reserved for 'test'-namespace\
	 * you need to use the `./test/index.ts` file instead
	 */
	'test'?: "[typesafe-i18n] reserved for 'test'-namespace. You need to use the `./test/index.ts` file instead."
}

export type TranslationFunctions = {
	/**
	 * some text
	 */
	'wow': () => LocalizedString
	'test': {
		/**
		 * hello
		 */
		'hi': () => LocalizedString
	}
}

export type Formatters = {}
