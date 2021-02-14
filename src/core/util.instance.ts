import type { TranslationFunctions, BaseFormatters, BaseTranslation, Locale } from './core'
import type { FormattersInitializer, LocaleTranslationFunctions } from './util.loader'
import { i18nLoader } from './util.loader'

export const i18n = <
	L extends Locale,
	T extends BaseTranslation,
	TF extends TranslationFunctions,
	F extends BaseFormatters
>(
	getTranslationForLocale: (locale: L) => T,
	formattersInitializer: FormattersInitializer<L, F>,
): LocaleTranslationFunctions<L, TF> => {
	return new Proxy<LocaleTranslationFunctions<L, TF>>({} as LocaleTranslationFunctions<L, TF>, {
		get: (_target, locale: L): TF | null =>
			i18nLoader<L, T, TF, F>(locale, getTranslationForLocale, formattersInitializer),
	})
}
