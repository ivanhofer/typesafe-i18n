import { Component, createComponent, createContext, useContext } from 'solid-js'
import { $RAW, createStore } from 'solid-js/store'
import type { BaseFormatters, BaseTranslation, Locale, TranslationFunctions } from '../../runtime/src/core'
import { getFallbackProxy } from '../../runtime/src/core-utils'
import { i18nObject } from '../../runtime/src/util.object'

// --------------------------------------------------------------------------------------------------------------------
// types --------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------

export type I18nContextType<
	L extends string = string,
	T extends BaseTranslation | BaseTranslation[] = BaseTranslation,
	TF extends TranslationFunctions<T> = TranslationFunctions<T>,
> = {
	locale: L
	LL: TF
	setLocale: (locale: L) => void
}

export type TypesafeI18nProps<L extends string> = {
	locale: L
}

export type SolidInit<
	L extends string = string,
	T extends BaseTranslation | BaseTranslation[] = BaseTranslation,
	TF extends TranslationFunctions<T> = TranslationFunctions<T>,
> = {
	TypesafeI18n: Component<TypesafeI18nProps<L>>
	useI18nContext: () => I18nContextType<L, T, TF>
}

// --------------------------------------------------------------------------------------------------------------------
// implementation -----------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------

const wrapProxy = <T>(proxy: T): T =>
	({
		[$RAW]: proxy,
	} as unknown as T)

export const initI18nSolid = <
	L extends Locale = Locale,
	T extends BaseTranslation = BaseTranslation,
	TF extends TranslationFunctions<T> = TranslationFunctions<T>,
	F extends BaseFormatters = BaseFormatters,
>(
	translations: Record<L, T>,
	formatters: Record<L, F> = {} as Record<L, F>,
): SolidInit<L, T, TF> => {
	const I18nContext = createContext({} as I18nContextType<L, T, TF>)

	const TypesafeI18n: Component<TypesafeI18nProps<L>> = (props) => {
		const setLocale = (newLocale: L): void =>
			setState((v) => ({
				...v,
				locale: newLocale,
				LL: wrapProxy(i18nObject<L, T, TF, F>(newLocale, translations[newLocale], formatters[newLocale])),
			}))

		const [state, setState] = createStore<I18nContextType<L, T, TF>>({
			locale: null as unknown as L,
			LL: wrapProxy(getFallbackProxy<TF>()),
			setLocale,
		})

		!state.locale && setLocale(props.locale)

		return createComponent(I18nContext.Provider, { value: state, children: () => props.children })
	}

	const useI18nContext = (): I18nContextType<L, T, TF> => useContext(I18nContext)

	return { TypesafeI18n, useI18nContext }
}
