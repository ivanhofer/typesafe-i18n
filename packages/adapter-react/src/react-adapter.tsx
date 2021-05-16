import React, { createContext, useState } from 'react'
import type { BaseFormatters, BaseTranslation, TranslationFunctions } from '@typesafe-i18n/core/src/core'
import { getFallbackProxy } from '@typesafe-i18n/core/src/core-utils'
import {
	AsyncFormattersInitializer,
	FormattersInitializer,
	TranslationLoader,
	TranslationLoaderAsync,
} from '@typesafe-i18n/core/src/util.loader'
import { i18nObject } from '@typesafe-i18n/core/src/util.object'

// --------------------------------------------------------------------------------------------------------------------
// types --------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------

export type I18nContextType<
	L extends string = string,
	T extends BaseTranslation = BaseTranslation,
	TF extends TranslationFunctions = TranslationFunctions<T>,
> = {
	setLocale: (locale: L) => Promise<void>
	isLoadingLocale: boolean
	locale: L
	LL: TF
}

type TypesafeI18nProps<L extends string> = {
	initialLocale?: L
}

// --------------------------------------------------------------------------------------------------------------------
// implementation -----------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------

export const initI18nReact = <
	L extends string = string,
	T extends BaseTranslation = BaseTranslation,
	TF extends TranslationFunctions = TranslationFunctions<T>,
	F extends BaseFormatters = BaseFormatters,
>(
	baseLocale: L = '' as L,
	getTranslationForLocale: TranslationLoader<L, T> | TranslationLoaderAsync<L, T> = () => ({} as T),
	initFormatters: FormattersInitializer<L, F> | AsyncFormattersInitializer<L, F> = () => ({} as F),
): { component: React.FunctionComponent<TypesafeI18nProps<L>>; context: React.Context<I18nContextType<L, T, TF>> } => {
	const context = getI18nContext<L, T, TF>()

	const component: React.FunctionComponent<TypesafeI18nProps<L>> = (props) => {
		const [isLoadingLocale, setIsLoadingLocale] = useState<boolean>(false)
		const [currentLocale, setCurrentLocale] = useState<L>(null as unknown as L)
		const [LL, setLL] = useState<TranslationFunctions>(getFallbackProxy<TranslationFunctions>())

		const setLocale = async (newLocale: L): Promise<void> => {
			setIsLoadingLocale(true)

			const translation: T = (getTranslationForLocale as TranslationLoader<L, T>)(newLocale)
			setLL(i18nObject<L, T, TF, F>(newLocale, translation, await initFormatters(newLocale)))

			setCurrentLocale(newLocale)
			setIsLoadingLocale(false)
		}

		!currentLocale && !isLoadingLocale && setLocale(props.initialLocale || baseLocale)

		if (!isLoadingLocale && !LL) {
			return null
		}

		const ctx = { setLocale, isLoadingLocale, locale: currentLocale, LL } as I18nContextType<L, T, TF>

		return <context.Provider value={ctx}>{props.children}</context.Provider>
	}

	return { component, context }
}

const getI18nContext = <
	L extends string = string,
	T extends BaseTranslation = BaseTranslation,
	TF extends TranslationFunctions = TranslationFunctions<T>,
>() => createContext({} as I18nContextType<L, T, TF>)
