import { useState, createContext } from 'react'
import { BaseFormatters, BaseTranslation, TranslationFunctions } from '../core/core'
import { getFallbackProxy } from '../core/core-utils'
import {
	AsyncFormattersInitializer,
	FormattersInitializer,
	TranslationLoader,
	TranslationLoaderAsync,
} from '../core/util.loader'
import { i18nObject } from '../core/util.object'

// --------------------------------------------------------------------------------------------------------------------
// types --------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------

type I18nContextType<
	L extends string = string,
	T extends BaseTranslation = BaseTranslation,
	TF extends TranslationFunctions = TranslationFunctions<T>
	> = {
		setLocale: (locale: L) => void
		isLoadingLocale: boolean
		locale: L
		LL: TF
	}

type ReactContextInit<
	L extends string = string,
	T extends BaseTranslation = BaseTranslation,
	TF extends TranslationFunctions = TranslationFunctions<T>,
	F extends BaseFormatters = BaseFormatters
	> = {
		initI18n: (
			newlocale: L,
			getTranslationForLocaleCallback: TranslationLoader<L, T> | TranslationLoaderAsync<L, T>,
			initFormattersCallback?: FormattersInitializer<L, F> | AsyncFormattersInitializer<L, F>,
		) => Promise<I18nContextType<L, T, TF>>
		context: React.Context<I18nContextType<L, T, TF>>
	}

// --------------------------------------------------------------------------------------------------------------------
// implementation -----------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------

export const getReactHelpers = <
	L extends string = string,
	T extends BaseTranslation = BaseTranslation,
	TF extends TranslationFunctions = TranslationFunctions<T>,
	F extends BaseFormatters = BaseFormatters
>(
	baseLocale: L = '' as L,
): ReactContextInit<L, T, TF, F> => {
	const initI18n = async (
		newlocale: L = baseLocale,
		getTranslationForLocaleCallback: TranslationLoader<L, T> | TranslationLoaderAsync<L, T>,
		initFormattersCallback?: FormattersInitializer<L, F> | AsyncFormattersInitializer<L, F>,
	): Promise<I18nContextType<L, T, TF>> => {
		const getTranslationForLocale = getTranslationForLocaleCallback
		const initFormatters = initFormattersCallback || (() => ({} as F))

		const [isLoadingLocale, setIsLoadingLocale] = useState<boolean>(false)
		const [locale, setCurrentLocale] = useState<L>((null as unknown) as L)
		const [LL, setLL] = useState<TF>(getFallbackProxy<TF>())

		const setLocale = async (newLocale: L): Promise<void> => {
			setIsLoadingLocale(true)

			const translation: T = await (getTranslationForLocale as TranslationLoaderAsync<L, T>)(newLocale)
			setLL(i18nObject<L, T, TF, F>(newLocale, translation, await initFormatters(newlocale)))

			setCurrentLocale(newLocale)
			setIsLoadingLocale(false)
		}

		if (!locale) setLocale(newlocale)

		return { setLocale, isLoadingLocale, locale, LL }
	}

	const context = createContext<I18nContextType<L, T, TF>>({} as I18nContextType<L, T, TF>)

	return { initI18n, context }
}
