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
	 * C​l​i​c​k​ ​o​n​ ​t​h​e​ ​b​u​t​t​o​n​:​ ​<​b​u​t​t​o​n​>​{​b​u​t​t​o​n​T​e​x​t​}​<​/​b​u​t​t​o​n​>
	 * @param {LocalizedString} buttonText
	 */
	localized: RequiredParams<'buttonText'>
}

export type TranslationFunctions = {
	/**
	 * Click on the button: <button>{buttonText}</button>
	 */
	localized: (arg: { buttonText: LocalizedString }) => LocalizedString
}

export type Formatters = {}
