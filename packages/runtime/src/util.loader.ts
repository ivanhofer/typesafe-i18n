import type { BaseFormatters, BaseTranslation, Locale, TranslationFunctions } from './core'
import { i18nObject } from './util.object'

// --------------------------------------------------------------------------------------------------------------------
// types --------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------

export type LocaleTranslationFunctions<
	L extends Locale = Locale,
	T extends BaseTranslation | BaseTranslation[] | Readonly<BaseTranslation> | Readonly<BaseTranslation[]> =
		| BaseTranslation
		| BaseTranslation[]
		| Readonly<BaseTranslation>
		| Readonly<BaseTranslation[]>,
	TF extends TranslationFunctions<T> = TranslationFunctions<T>,
> = {
	[key in L]: TF
}

export type LocaleTranslations<L extends Locale, T = unknown> = {
	[key in L]: T
}

export type TranslationLoader<
	L extends Locale,
	T extends BaseTranslation | BaseTranslation[] | Readonly<BaseTranslation> | Readonly<BaseTranslation[]>,
> = (locale: L) => T

export type TranslationLoaderAsync<
	L extends Locale,
	T extends BaseTranslation | BaseTranslation[] | Readonly<BaseTranslation> | Readonly<BaseTranslation[]>,
> = (locale: L) => Promise<T>

export type FormattersInitializer<L extends Locale, F extends BaseFormatters> = (locale: L) => F

export type AsyncFormattersInitializer<L extends Locale, F extends BaseFormatters> = (locale: L) => Promise<F>

// --------------------------------------------------------------------------------------------------------------------
// implementation -----------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const i18nObjectInstancesCache = {} as LocaleTranslationFunctions<Locale, BaseTranslation | BaseTranslation[], any>

// async --------------------------------------------------------------------------------------------------------------

export const i18nObjectLoaderAsync = async <
	L extends Locale,
	T extends BaseTranslation | BaseTranslation[],
	TF extends TranslationFunctions<T>,
	F extends BaseFormatters,
>(
	locale: L,
	getTranslationForLocale: TranslationLoaderAsync<L, T>,
	formattersInitializer: FormattersInitializer<L, F> | AsyncFormattersInitializer<L, F>,
): Promise<TF> =>
	i18nObjectInstancesCache[locale] ||
	(i18nObjectInstancesCache[locale] = i18nObject<L, T, TF, F>(
		locale,
		await getTranslationForLocale(locale),
		await formattersInitializer(locale),
	))

// sync ---------------------------------------------------------------------------------------------------------------

export const i18nObjectLoader = <
	L extends Locale,
	T extends BaseTranslation | BaseTranslation[] | Readonly<BaseTranslation> | Readonly<BaseTranslation[]>,
	TF extends TranslationFunctions<T>,
	F extends BaseFormatters,
>(
	locale: L,
	getTranslationForLocale: TranslationLoader<L, T>,
	formattersInitializer: FormattersInitializer<L, F>,
): TF =>
	i18nObjectInstancesCache[locale] ||
	(i18nObjectInstancesCache[locale] = i18nObject<L, T, TF, F>(
		locale,
		getTranslationForLocale(locale),
		formattersInitializer(locale),
	))
