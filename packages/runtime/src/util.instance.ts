import type { BaseFormatters, BaseTranslation, Locale, TranslationFunctions } from './core'
import { i18nObject } from './util.object'

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

export const i18n = <
	L extends Locale,
	T extends BaseTranslation | BaseTranslation[] | Readonly<BaseTranslation> | Readonly<BaseTranslation[]>,
	TF extends TranslationFunctions<T>,
	F extends BaseFormatters,
>(
	translations: Record<L, T>,
	formatters: Record<L, F>,
): LocaleTranslationFunctions<L, T, TF> => {
	const cache = {} as LocaleTranslationFunctions<L, T, TF>

	return new Proxy<LocaleTranslationFunctions<L, T, TF>>({} as LocaleTranslationFunctions<L, T, TF>, {
		get: (_target, locale: L): TF | null =>
			cache[locale] || (cache[locale] = i18nObject<L, T, TF, F>(locale, translations[locale], formatters[locale])),
	})
}
