import React from 'react'
import type { BaseFormatters, BaseTranslation, TranslationFunctions } from '../../core/src/core'
import { getFallbackProxy } from '../../core/src/core-utils'
import {
	AsyncFormattersInitializer,
	FormattersInitializer,
	TranslationLoader,
	TranslationLoaderAsync
} from '../../core/src/util.loader'
import { i18nObject } from '../../core/src/util.object'

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

export type TypesafeI18nProps<L extends string> = {
	initialLocale?: L
}

export type ReactInit<
L extends string = string,
	T extends BaseTranslation = BaseTranslation,
	TF extends TranslationFunctions = TranslationFunctions<T>> = {
	component: React.FunctionComponent<TypesafeI18nProps<L>>
	context: React.Context<I18nContextType<L, T, TF>>
}

// --------------------------------------------------------------------------------------------------------------------
// implementation -----------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------

export const initI18nReact = <
	L extends string = string,
	T extends BaseTranslation = BaseTranslation,
	TF extends TranslationFunctions<T> = TranslationFunctions<T>,
	F extends BaseFormatters = BaseFormatters,
>(
	baseLocale: L = '' as L,
	getTranslationForLocale: TranslationLoader<L, T> | TranslationLoaderAsync<L, T> = () => ({} as T),
	initFormatters: FormattersInitializer<L, F> | AsyncFormattersInitializer<L, F> = () => ({} as F),
): ReactInit<L, T, TF> => {
	const context = getI18nContext<L, T, TF>()

	const component: React.FunctionComponent<TypesafeI18nProps<L>> = (props) => {
		const [isLoadingLocale, setIsLoadingLocale] = React.useState<boolean>(false)
		const [currentLocale, setCurrentLocale] = React.useState<L>(null as unknown as L)
		const [LL, setLL] = React.useState<TranslationFunctions>(getFallbackProxy<TranslationFunctions>())

		const setLocale = async (newLocale: L): Promise<void> => {
			setIsLoadingLocale(true)

			const translation = getTranslationForLocale(newLocale)
			const formatters = initFormatters(newLocale)

			setLL(
				i18nObject<L, T, TF, F>(
					newLocale,
					translation instanceof Promise ? await translation : translation,
					formatters instanceof Promise ? await formatters : formatters,
				),
			)

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
>() => React.createContext({} as I18nContextType<L, T, TF>)
