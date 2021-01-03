import type { Formatters, LangaugeBaseTranslation, TranslatorFn } from './core'
import type { ConfigWithFormatters } from '../core/core'
import { langauge } from './core'

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

// --------------------------------------------------------------------------------------------------------------------
// implementation -----------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------

const langaugeInstancesCache: LocaleTranslationFns = {} as LocaleTranslationFns

export const getLangaugeInstance = <
	L extends string,
	T extends LangaugeBaseTranslation,
	// eslint-disable-next-line @typescript-eslint/ban-types
	A extends object = TranslatorFn<T>,
	F extends Formatters = Formatters
>(
	localeTranlslations: LocaleTranslations<L, T>,
	locale: L,
	config: ConfigWithFormatters<F>,
): A => {
	if (langaugeInstancesCache[locale]) {
		return langaugeInstancesCache[locale]
	}

	const foundTranslation = localeTranlslations[locale]
	if (!foundTranslation) {
		throw new Error(`[LANGAUGE] ERROR: could not find locale '${locale}'`)
	}

	const lang = langauge<T, A, F>(foundTranslation, config)
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
	localeTranlslations: LocaleTranslations<L, T>,
	config: ConfigWithFormatters<F>,
): LocaleTranslationFns<L, A> => {
	return new Proxy<LocaleTranslationFns<L, A>>({} as LocaleTranslationFns<L, A>, {
		get: (_target, locale: L): A | null => getLangaugeInstance<L, T, A, F>(localeTranlslations, locale, config),
	})
}
