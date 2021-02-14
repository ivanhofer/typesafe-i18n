import type { BaseFormatters, BaseTranslation, Locale, TranslationFunctions } from './core'
import { i18nObject } from './util.object'

// --------------------------------------------------------------------------------------------------------------------
// types --------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------

export type LocaleTranslationFunctions<
	L extends Locale = Locale,
	TF extends TranslationFunctions = TranslationFunctions
	> = {
		[key in L]: TF
	}

export type LocaleTranslations<L extends Locale, T = unknown> = {
	[key in L]: T
}

export type FormatterInitializer<L extends Locale, F extends BaseFormatters> = (locale: L) => F

// --------------------------------------------------------------------------------------------------------------------
// implementation -----------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const i18nObjectInstancesCache = {} as LocaleTranslationFunctions<Locale, any>

const throwError = (locale: Locale) => {
	throw new Error(`[typesafe-i18n] ERROR: could not find locale '${locale}'`)
}

// async --------------------------------------------------------------------------------------------------------------

export const i18nLoaderAsync = async <
	L extends Locale,
	T extends BaseTranslation,
	TF extends TranslationFunctions,
	F extends BaseFormatters
>(
	locale: L,
	getTranslationForLocale: (locale: L) => Promise<T>,
	formattersInitializer: FormatterInitializer<L, F>,
): Promise<TF> => {
	if (i18nObjectInstancesCache[locale]) {
		return i18nObjectInstancesCache[locale]
	}

	const foundTranslation = await getTranslationForLocale(locale)
	if (!foundTranslation) {
		throwError(locale)
	}

	const i18nObjectInstance = i18nObject<L, T, TF, F>(locale, foundTranslation, formattersInitializer(locale))
	i18nObjectInstancesCache[locale] = i18nObjectInstance

	return i18nObjectInstance as TF
}

// sync ---------------------------------------------------------------------------------------------------------------

export const i18nLoader = <
	L extends Locale,
	T extends BaseTranslation,
	TF extends TranslationFunctions,
	F extends BaseFormatters
>(
	locale: L,
	getTranslationForLocale: (locale: L) => T,
	formattersInitializer: FormatterInitializer<L, F>,
): TF => {
	if (i18nObjectInstancesCache[locale]) {
		return i18nObjectInstancesCache[locale]
	}

	const foundTranslation = getTranslationForLocale(locale)
	if (!foundTranslation) {
		throwError(locale)
	}

	const i18nObjectInstance = i18nObject<L, T, TF, F>(locale, foundTranslation, formattersInitializer(locale))
	i18nObjectInstancesCache[locale] = i18nObjectInstance

	return i18nObjectInstance as TF
}
