import type {
	Arguments,
	BaseFormatters,
	BaseTranslation,
	Cache,
	Locale,
	LocalizedString,
	TranslationFunctions,
} from './core'
import { translate } from './core'
import { getPartsFromString } from './util.string'

type TranslateFn = (text: string, ...args: Arguments) => LocalizedString

const getTranslateInstance = <
	L extends Locale,
	T extends BaseTranslation | BaseTranslation[],
	F extends BaseFormatters,
>(
	locale: L,
	formatters: F,
): TranslateFn => {
	const cache = {} as Cache<T>
	const pluralRules = new Intl.PluralRules(locale)
	return (text: string, ...args: Arguments) =>
		translate(getPartsFromString(cache, text), pluralRules, formatters, args)
}

export function i18nObject<
	L extends Locale,
	T extends BaseTranslation | BaseTranslation[] | Readonly<BaseTranslation> | Readonly<BaseTranslation[]>,
	TF extends TranslationFunctions<T> = TranslationFunctions<T>,
	F extends BaseFormatters = BaseFormatters,
>(locale: L, translations: T, formatters: F): TF

export function i18nObject<
	L extends Locale,
	T extends BaseTranslation | BaseTranslation[],
	TF extends TranslationFunctions<T> = TranslationFunctions<T>,
>(locale: L, translations: T): TF

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
export function i18nObject(locale: any, translations: any, formatters: any = {}): any {
	return createProxy(translations, getTranslateInstance(locale, formatters))
}

/* PROXY-START */
const createProxy = <T extends BaseTranslation | BaseTranslation[]>(
	proxyObject: T,
	translateFn: TranslateFn,
): TranslationFunctions<T> =>
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	new Proxy(proxyObject as any, {
		get: (target, key: string) => {
			const value: unknown = target[key]
			if (Array.isArray(target) && key === 'length') return value

			return typeof value === 'string' ? translateFn.bind(null, value) : createProxy(value as T, translateFn)
		},
	})
/* PROXY-END */

/* PROXY-CJS-START */
const createCjsProxy = <T extends BaseTranslation | BaseTranslation[]>(
	proxyObject: T,
	translateFn: TranslateFn,
): TranslationFunctions<T> =>
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	new Proxy(proxyObject as any, {
		get: (target, key: string) => {
			if (target === proxyObject && key === 'then') return null

			const value: unknown = target[key]
			if (Array.isArray(target) && key === 'length') return value

			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			return typeof value === 'string' ? translateFn.bind(null, value) : createCjsProxy(value as T, translateFn)
		},
	})
/* PROXY-CJS-END */
