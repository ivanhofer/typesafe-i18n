import { LangaugeBaseTranslation } from '..'
import { TranslatorFn, Formatters } from './core'
import { LangaugeFormatterInitializer, langaugeLoader, LocaleTranslationFns } from './util.loader'

export const langauge = <
	L extends string,
	T extends LangaugeBaseTranslation,
	// eslint-disable-next-line @typescript-eslint/ban-types
	A extends object = TranslatorFn<T>,
	F extends Formatters = Formatters
>(
	getTranslationForLocale: (locale: L) => T,
	formattersInitializer: LangaugeFormatterInitializer<L, F>,
): LocaleTranslationFns<L, A> => {
	return new Proxy<LocaleTranslationFns<L, A>>({} as LocaleTranslationFns<L, A>, {
		get: (_target, locale: L): A | null =>
			langaugeLoader<L, T, A, F>(locale, getTranslationForLocale, formattersInitializer),
	})
}
