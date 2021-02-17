import type { BaseFormatters, BaseTranslation, TranslationFunctions } from '../core/core'
import type { Readable, Writable } from 'svelte/store'
import { derived, writable } from 'svelte/store'
import { i18nObject } from '../core/util.object'
import { FormattersInitializer, TranslationLoader, TranslationLoaderAsync } from '../core/util.loader'

// --------------------------------------------------------------------------------------------------------------------
// types --------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------

type SvelteStoreInit<
	L extends string = string,
	T extends BaseTranslation = BaseTranslation,
	TF extends TranslationFunctions = TranslationFunctions<T>,
	F extends BaseFormatters = BaseFormatters
	> = {
		initI18n: (
			newlocale: L,
			getTranslationForLocaleCallback: TranslationLoader<L, T> | TranslationLoaderAsync<L, T>,
			initFormattersCallback?: FormattersInitializer<L, F>,
		) => Promise<void>
		setLocale: (locale: L) => void
		isLoadingLocale: Readable<boolean>
		locale: Readable<L>
		LL: Readable<TF> & TF
	}

// --------------------------------------------------------------------------------------------------------------------
// implementation -----------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------

export const getI18nSvelteStore = <
	L extends string = string,
	T extends BaseTranslation = BaseTranslation,
	TF extends TranslationFunctions = TranslationFunctions<T>,
	F extends BaseFormatters = BaseFormatters
>(
	baseLocale: L = '' as L,
): SvelteStoreInit<L, T, TF, F> => {
	const currentLocale = writable<L>(baseLocale)

	const isLoading = writable<boolean>(false)

	let i18nObjectInstance = new Proxy({} as TF, {
		get: (_target, key: string) => () => key,
	})

	const i18nObjectInstanceStore = writable<TF>(i18nObjectInstance)

	let getTranslationForLocale: TranslationLoader<L, T> | TranslationLoaderAsync<L, T>
	let initFormatters: FormattersInitializer<L, F>

	const initI18n = async (
		newlocale: L,
		getTranslationForLocaleCallback: TranslationLoader<L, T> | TranslationLoaderAsync<L, T>,
		initFormattersCallback?: FormattersInitializer<L, F>,
	): Promise<void> => {
		getTranslationForLocale = getTranslationForLocaleCallback
		initFormatters = initFormattersCallback || (() => ({} as F))
		await setLocale(newlocale)
	}

	const setLocale = async (newlocale: L): Promise<void> => {
		if (!newlocale || !getTranslationForLocale) return

		isLoading.set(true)

		const translation: T = await (getTranslationForLocale as TranslationLoaderAsync<L, T>)(newlocale)
		i18nObjectInstance = i18nObject(newlocale, translation, initFormatters(newlocale))
		i18nObjectInstanceStore.set(i18nObjectInstance)

		currentLocale.set(newlocale)

		isLoading.set(false)
	}

	const locale = derived<Writable<L>, L>(currentLocale, (newlocale, set) => set(newlocale))

	const isLoadingLocale = derived<Writable<boolean>, boolean>(isLoading, (loading, set) => set(loading))

	const LL = new Proxy({} as Readable<TF> & TF, {
		get: (_target, key: keyof TF & 'subscribe') =>
			key === 'subscribe' ? i18nObjectInstanceStore.subscribe : i18nObjectInstance[key],
	})

	return {
		initI18n,
		setLocale,
		isLoadingLocale,
		locale,
		LL,
	}
}
