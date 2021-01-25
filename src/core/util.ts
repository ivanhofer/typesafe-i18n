import type { Formatters, LangaugeBaseTranslation, TranslatorFn } from './core'
import { langaugeObjectWrapper } from './core'

// --------------------------------------------------------------------------------------------------------------------
// types --------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any
type LocaleTranslationFns<L extends string = any, A extends object = any> = {
	[key in L]: A
}

export type LocaleTranslations<L extends string, T = unknown> = {
	[key in L]: T
}

type LangaugeFormatterInitializer<L extends string, F extends Formatters> = (locale: L) => F

// --------------------------------------------------------------------------------------------------------------------
// implementation -----------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------

const langaugeInstancesCache: LocaleTranslationFns = {} as LocaleTranslationFns

// async --------------------------------------------------------------------------------------------------------------

export const getLangaugeInstanceAsync = async <
	L extends string,
	T extends LangaugeBaseTranslation,
	// eslint-disable-next-line @typescript-eslint/ban-types
	A extends object = TranslatorFn<T>,
	F extends Formatters = Formatters
>(
	locale: L,
	getTranslationFromLocale: (locale: L) => Promise<T>,
	formattersInitializer: LangaugeFormatterInitializer<L, F>,
): Promise<A> => {
	if (langaugeInstancesCache[locale]) {
		return langaugeInstancesCache[locale]
	}

	const foundTranslation = await getTranslationFromLocale(locale)
	if (!foundTranslation) {
		throw new Error(`[LANGAUGE] ERROR: could not find locale '${locale}'`)
	}

	const lang = langaugeObjectWrapper<L, T, A, F>(locale, foundTranslation, formattersInitializer(locale))
	langaugeInstancesCache[locale] = lang

	return lang as A
}

// sync ---------------------------------------------------------------------------------------------------------------

export const getLangaugeInstance = <
	L extends string,
	T extends LangaugeBaseTranslation,
	// eslint-disable-next-line @typescript-eslint/ban-types
	A extends object = TranslatorFn<T>,
	F extends Formatters = Formatters
>(
	locale: L,
	getTranslationFromLocale: (locale: L) => T,
	formattersInitializer: LangaugeFormatterInitializer<L, F>,
): A => {
	if (langaugeInstancesCache[locale]) {
		return langaugeInstancesCache[locale]
	}

	const foundTranslation = getTranslationFromLocale(locale)
	if (!foundTranslation) {
		throw new Error(`[LANGAUGE] ERROR: could not find locale '${locale}'`)
	}

	const lang = langaugeObjectWrapper<L, T, A, F>(locale, foundTranslation, formattersInitializer(locale))
	langaugeInstancesCache[locale] = lang

	return lang as A
}

export const initLangauge = <
	L extends string,
	T extends LangaugeBaseTranslation,
	// eslint-disable-next-line @typescript-eslint/ban-types
	A extends object = TranslatorFn<T>,
	F extends Formatters = Formatters
>(
	getTranslationFromLocale: (locale: L) => T,
	formattersInitializer: LangaugeFormatterInitializer<L, F>,
): LocaleTranslationFns<L, A> => {
	return new Proxy<LocaleTranslationFns<L, A>>({} as LocaleTranslationFns<L, A>, {
		get: (_target, locale: L): A | null =>
			getLangaugeInstance<L, T, A, F>(locale, getTranslationFromLocale, formattersInitializer),
	})
}
