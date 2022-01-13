import type { BaseFormatters, BaseTranslation, Locale, TranslationFunctions } from './core'
import type { FormattersInitializer, LocaleTranslationFunctions } from './util.loader'
import { initI18nObjectLoader } from './util.loader'

export const i18n = <
	L extends Locale,
	T extends BaseTranslation | BaseTranslation[] | Readonly<BaseTranslation> | Readonly<BaseTranslation[]>,
	TF extends TranslationFunctions<T>,
	F extends BaseFormatters,
>(
	getTranslationForLocale: (locale: L) => T,
	formattersInitializer: FormattersInitializer<L, F>,
): LocaleTranslationFunctions<L, T, TF> => {
	const i18nObjectLoader = initI18nObjectLoader()

	return new Proxy<LocaleTranslationFunctions<L, T, TF>>({} as LocaleTranslationFunctions<L, T, TF>, {
		get: (_target, locale: L): TF | null =>
			i18nObjectLoader<L, T, TF, F>(locale, getTranslationForLocale, formattersInitializer),
	})
}
