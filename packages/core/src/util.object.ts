import type {
	Arguments, BaseFormatters, BaseTranslation, Cache, Locale, TranslationFunctions, TranslationKey
} from './core'
import { translate } from './core'
import { getPartsFromString } from './util.string'

type TranslateByKey<T extends BaseTranslation> = (key: TranslationKey<T>, ...args: Arguments) => string

const getTextFromTranslationKey = <T extends BaseTranslation>(translations: T, key: TranslationKey<T>): string => {
	; (key as string).split('.').forEach((k) => (translations = translations[k] as T))
	return (translations as unknown as string) ?? (key as string)
}

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
	F extends BaseFormatters = BaseFormatters,
	>(locale: L, translations: T, formatters: F): TF

export function i18nObject<
	L extends Locale,
	T extends BaseTranslation,
	TF extends TranslationFunctions = TranslationFunctions<T>,
	>(locale: L, translations: T): TF

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
export function i18nObject(locale: any, translations: any, formatters: any = {}): any {
	return createProxy(getTranslateInstance(locale, translations, formatters))
}

const createProxy = <T extends BaseTranslation>(fn: TranslateByKey<T>, prefixKey?: string, proxyObject = {}): TranslationFunctions<T> =>
	new Proxy((prefixKey ? fn.bind(null, prefixKey) : proxyObject) as TranslationFunctions<T>, {
		get: (target, key: string) => !(target === proxyObject && key === 'then') && createProxy(fn, prefixKey ? `${prefixKey}.${key}` : key),
	})
