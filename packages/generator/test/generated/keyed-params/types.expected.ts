// This file was auto-generated by 'typesafe-i18n'. Any manual changes will be overwritten.
/* eslint-disable */
import type { BaseTranslation as BaseTranslationType, LocalizedString, RequiredParams } from 'typesafe-i18n'

export type BaseTranslation = BaseTranslationType
export type BaseLocale = 'en'

export type Locales =
	| 'en'

export type Translation = RootTranslation

export type Translations = RootTranslation

type RootTranslation = {
	/**
	 * {​n​r​O​f​A​p​p​l​e​s​}​ ​a​p​p​l​e​{​{​s​}​}
	 * @param {string | number | boolean} nrOfApples
	 */
	KEYED_PARAM: RequiredParams<'nrOfApples'>
	/**
	 * {​n​r​O​f​A​p​p​l​e​s​}​ ​a​p​p​l​e​{​{​s​}​}​ ​a​n​d​ ​{​n​r​O​f​B​a​n​a​n​a​s​}​ ​b​a​n​a​n​a​{​{​s​}​}
	 * @param {string | number | boolean} nrOfApples
	 * @param {string | number | boolean} nrOfBananas
	 */
	KEYED_PARAMS: RequiredParams<'nrOfApples' | 'nrOfBananas'>
}

export type TranslationFunctions = {
	/**
	 * {nrOfApples} apple{{s}}
	 */
	KEYED_PARAM: (arg: { nrOfApples: string | number | boolean }) => LocalizedString
	/**
	 * {nrOfApples} apple{{s}} and {nrOfBananas} banana{{s}}
	 */
	KEYED_PARAMS: (arg: { nrOfApples: string | number | boolean, nrOfBananas: string | number | boolean }) => LocalizedString
}

export type Formatters = {}
