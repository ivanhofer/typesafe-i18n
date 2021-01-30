import type {
	Cache,
	LangaugeBaseFormatters,
	TranslatorFn,
	LangaugeBaseTranslation,
	LangaugeTranslationKey,
} from './core'
import { translate } from './core'
import { getPartsFromString } from './util.string'

type TranslateByKey<T> = (key: LangaugeTranslationKey<T>, ...args: unknown[]) => string

const getTextFromTranslationKey = <T extends LangaugeBaseTranslation>(
	translations: T,
	key: LangaugeTranslationKey<T>,
): string => translations[key] ?? (key as string)

const getTranslateInstance = <L extends string, T extends LangaugeBaseTranslation, F extends LangaugeBaseFormatters>(
	locale: L,
	translations: T,
	formatters: F,
): TranslateByKey<T> => {
	const cache = {} as Cache<T>
	const pluralRules = new Intl.PluralRules(locale)
	return (key: LangaugeTranslationKey<T>, ...args: unknown[]) =>
		translate(getPartsFromString(cache, getTextFromTranslationKey(translations, key)), pluralRules, formatters, args)
}

export function langaugeObjectWrapper<
	L extends string,
	T extends LangaugeBaseTranslation,
	// eslint-disable-next-line @typescript-eslint/ban-types
	A extends object = TranslatorFn<T>,
	F extends LangaugeBaseFormatters = LangaugeBaseFormatters
>(locale: L, translations: T, formatters: F): A

export function langaugeObjectWrapper<
	L extends string,
	T extends LangaugeBaseTranslation,
	// eslint-disable-next-line @typescript-eslint/ban-types
	A extends object = TranslatorFn<T>
>(locale: L, translations: T): A

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
export function langaugeObjectWrapper(locale: any, translations: any, formatters: any = {}): any {
	const translateFunctionInstance = getTranslateInstance(locale, translations, formatters)

	return new Proxy(
		{},
		{
			get: (_target, key: string) => translateFunctionInstance.bind(null, key),
		},
	)
}
