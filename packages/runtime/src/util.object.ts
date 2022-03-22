import type {
	Arguments,
	BaseFormatters,
	BaseTranslation,
	Cache,
	Locale,
	LocalizedString,
	TranslationFunctions,
	TypedTranslationFunctions,
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

export function i18nObjectTyped<
	L extends Locale,
	T extends BaseTranslation | BaseTranslation[],
	F extends BaseFormatters = BaseFormatters,
>(locale: L, translations: T, formatters: F): TypedTranslationFunctions<T, F>

export function i18nObjectTyped<L extends Locale, T extends BaseTranslation | BaseTranslation[]>(
	locale: L,
	translations: T,
): TypedTranslationFunctions<T>

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
export function i18nObjectTyped(locale: any, translations: any, formatters: any = {}): any {
	return createProxy(translations, getTranslateInstance(locale, formatters))
}

const wrap = <T extends BaseTranslation | BaseTranslation[]>(proxyObject: T = {} as T, translateFn: TranslateFn) =>
	(typeof proxyObject === 'string'
		? translateFn.bind(null, proxyObject)
		: Object.assign(
				Object.defineProperty(() => '', 'name', { writable: true }),
				proxyObject,
		  )) as unknown as TranslationFunctions<T>

/* PROXY-START */
const createProxy = <T extends BaseTranslation | BaseTranslation[]>(
	proxyObject: T,
	translateFn: TranslateFn,
): TranslationFunctions<T> =>
	new Proxy(wrap(proxyObject, translateFn), {
		get: (target, key) => {
			if (key === Symbol.iterator)
				return [][Symbol.iterator].bind(Object.values(target).map((entry) => wrap(entry, translateFn)))

			return createProxy(target[key as keyof typeof target] as unknown as T, translateFn)
		},
	})

/* PROXY-END */

/* PROXY-CJS-START */
const createCjsProxy = <T extends BaseTranslation | BaseTranslation[]>(
	proxyObject: T = {} as T,
	translateFn: TranslateFn,
): TranslationFunctions<T> =>
	new Proxy(wrap(proxyObject, translateFn), {
		get: (target, key) => {
			if (key === 'then') return null

			if (key === Symbol.iterator)
				return [][Symbol.iterator].bind(Object.values(target).map((entry) => wrap(entry, translateFn)))

			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			return createCjsProxy(target[key as keyof typeof target] as unknown as T, translateFn)
		},
	})
/* PROXY-CJS-END */
