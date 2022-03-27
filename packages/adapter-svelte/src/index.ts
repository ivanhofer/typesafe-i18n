import type { Readable, Writable } from 'svelte/store'
import { derived, writable } from 'svelte/store'
import type { BaseFormatters, BaseTranslation, Locale, TranslationFunctions } from '../../runtime/src/core'
import { getFallbackProxy } from '../../runtime/src/core-utils'
import { i18nObject } from '../../runtime/src/util.object'

// --------------------------------------------------------------------------------------------------------------------
// types --------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------

export type SvelteStoreInit<
	L extends Locale = Locale,
	T extends BaseTranslation | BaseTranslation[] = BaseTranslation,
	TF extends TranslationFunctions<T> = TranslationFunctions<T>,
> = {
	locale: Readable<L>
	LL: Readable<TF>
	setLocale: (locale: L) => void
}

// --------------------------------------------------------------------------------------------------------------------
// implementation -----------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------

export const initI18nSvelte = <
	L extends Locale = Locale,
	T extends BaseTranslation | BaseTranslation[] = BaseTranslation,
	TF extends TranslationFunctions<T> = TranslationFunctions<T>,
	F extends BaseFormatters = BaseFormatters,
>(
	translations: Record<L, T>,
	formatters: Record<L, F> = {} as Record<L, F>,
): SvelteStoreInit<L, T, TF> => {
	const _locale = writable<L>()
	const _LL = writable<TF>(getFallbackProxy<TF>())

	const locale = derived<Writable<L>, L>(_locale, (newLocale, set) => set(newLocale))

	const LL = new Proxy({} as Readable<TF> & TF, {
		get: (_target, key: keyof TF & 'subscribe') => (key === 'subscribe' ? _LL.subscribe : _LL[key]),
	})

	const setLocale = (newLocale: L): void => {
		_locale.set(newLocale)
		_LL.set(i18nObject<L, T, TF, F>(newLocale, translations[newLocale], formatters[newLocale]))
	}

	return {
		locale,
		LL,
		setLocale,
	}
}
