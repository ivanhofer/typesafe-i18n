import type {
	Cache,
	BaseFormatters,
	TranslationFunctions,
	BaseTranslation,
	TranslationKey,
	Locale,
	Arguments,
} from './core'
import { translate } from './core'
import { getPartsFromString } from './util.string'

type TranslateByKey<T> = (key: TranslationKey<T>, ...args: Arguments) => string

const getTextFromTranslationKey = <T extends BaseTranslation>(translations: T, key: TranslationKey<T>): string =>
	translations[key] ?? (key as string)

const getTranslateInstance = <L extends Locale, T extends BaseTranslation, F extends BaseFormatters>(
	locale: L,
	translations: T,
	formatters: F,
): TranslateByKey<T> => {
	const cache = {} as Cache<T>
	const pluralRules = new Intl.PluralRules(locale)
	return (key: TranslationKey<T>, ...args: Arguments) =>
		translate(getPartsFromString(cache, getTextFromTranslationKey(translations, key)), pluralRules, formatters, args)
}

export function i18nObject<
	L extends Locale,
	T extends BaseTranslation,
	TF extends TranslationFunctions = TranslationFunctions<T>,
	F extends BaseFormatters = BaseFormatters
>(locale: L, translations: T, formatters: F): TF

export function i18nObject<
	L extends Locale,
	T extends BaseTranslation,
	TF extends TranslationFunctions = TranslationFunctions<T>
>(locale: L, translations: T): TF

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
export function i18nObject(locale: any, translations: any, formatters: any = {}): any {
	const translateFunctionInstance = getTranslateInstance(locale, translations, formatters)

	return new Proxy(
		{},
		{
			get: (_target, key: string) => {
				const fn = translateFunctionInstance.bind(null, key)
				const toString = () => {
					// eslint-disable-next-line no-console
					console.warn(
						`[typesafe-i18n] DEPRECATED translation call for '${key}'; see https://github.com/ivanhofer/typesafe-i18n/issues/27`,
					)
					fn()
				}
				return Object.assign(fn, { toString })
			},
		},
	)
}
