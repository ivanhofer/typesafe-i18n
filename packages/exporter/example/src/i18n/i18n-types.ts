// This file was auto-generated by 'typesafe-i18n'. Any manual changes will be overwritten.
/* eslint-disable */
import type { BaseTranslation as BaseTranslationType, LocalizedString, RequiredParams } from 'typesafe-i18n'

export type BaseTranslation = BaseTranslationType & DisallowNamespaces
export type BaseLocale = 'en'

export type Locales =
	| 'de'
	| 'en'

export type Translation = RootTranslation & DisallowNamespaces

export type Translations = RootTranslation &
{
	'my-namespace': NamespaceMyNamespaceTranslation
}

type RootTranslation = {
	/**
	 * H​i​ ​{​n​a​m​e​}​!​ ​P​l​e​a​s​e​ ​l​e​a​v​e​ ​a​ ​s​t​a​r​ ​i​f​ ​y​o​u​ ​l​i​k​e​ ​t​h​i​s​ ​p​r​o​j​e​c​t​:​ ​h​t​t​p​s​:​/​/​g​i​t​h​u​b​.​c​o​m​/​i​v​a​n​h​o​f​e​r​/​t​y​p​e​s​a​f​e​-​i​1​8​n
	 * @param {string} name
	 */
	HI: RequiredParams<'name'>
	/**
	 * T​h​i​s​ ​e​x​a​m​p​l​e​ ​d​e​m​o​n​s​t​r​a​t​e​s​ ​t​h​e​ ​e​x​p​o​r​t​e​r​ ​f​u​n​c​t​i​o​n​a​l​i​t​y
	 */
	exporter: string
}

export type NamespaceMyNamespaceTranslation = {
	i: {
		am: {
			inside: {
				a: {
					/**
					 * I​ ​a​m​ ​a​ ​n​e​s​t​e​d​ ​t​r​a​n​s​l​a​t​i​o​n​ ​l​o​c​a​t​e​d​ ​i​n​s​i​d​e​ ​a​ ​n​a​m​e​s​p​a​c​e
					 */
					namespace: string
				}
			}
		}
	}
}

export type Namespaces =
	| 'my-namespace'

type DisallowNamespaces = {
	/**
	 * reserved for 'my-namespace'-namespace\
	 * you need to use the `./my-namespace/index.ts` file instead
	 */
	'my-namespace'?: "[typesafe-i18n] reserved for 'my-namespace'-namespace. You need to use the `./my-namespace/index.ts` file instead."
}

export type TranslationFunctions = {
	/**
	 * Hi {name}! Please leave a star if you like this project: https://github.com/ivanhofer/typesafe-i18n
	 */
	HI: (arg: { name: string }) => LocalizedString
	/**
	 * This example demonstrates the exporter functionality
	 */
	exporter: () => LocalizedString
	'my-namespace': {
		i: {
			am: {
				inside: {
					a: {
						/**
						 * I am a nested translation located inside a namespace
						 */
						namespace: () => LocalizedString
					}
				}
			}
		}
	}
}

export type Formatters = {}
