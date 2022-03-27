import React from 'react'
import type { BaseFormatters, BaseTranslation, Locale, TranslationFunctions } from '../../runtime/src/core'
import { getFallbackProxy } from '../../runtime/src/core-utils'
import { i18nObject } from '../../runtime/src/util.object'

// --------------------------------------------------------------------------------------------------------------------
// types --------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------

export type I18nContextType<
	L extends Locale = Locale,
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

export type ReactInit<
	L extends Locale = Locale,
	T extends BaseTranslation | BaseTranslation[] = BaseTranslation,
	TF extends TranslationFunctions<T> = TranslationFunctions<T>,
> = {
	component: React.FunctionComponent<TypesafeI18nProps<L>>
	context: React.Context<I18nContextType<L, T, TF>>
}

// --------------------------------------------------------------------------------------------------------------------
// implementation -----------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------

export const initI18nReact = <
	L extends Locale = Locale,
	T extends BaseTranslation = BaseTranslation,
	TF extends TranslationFunctions<T> = TranslationFunctions<T>,
	F extends BaseFormatters = BaseFormatters,
>(
	translations: Record<L, T>,
	formatters: Record<L, F> = {} as Record<L, F>,
): ReactInit<L, T, TF> => {
	const context = React.createContext({} as I18nContextType<L, T, TF>)

	const component: React.FunctionComponent<TypesafeI18nProps<L>> = (props) => {
		const [locale, _setLocale] = React.useState<L>(null as unknown as L)
		const [LL, setLL] = React.useState<TF>(getFallbackProxy<TF>())

		const setLocale = (newLocale: L): void => {
			_setLocale(newLocale)
			setLL(() => i18nObject<L, T, TF, F>(newLocale, translations[newLocale], formatters[newLocale]))
		}

		!locale && setLocale(props.locale)

		const ctx = { setLocale, locale, LL } as I18nContextType<L, T, TF>

		return <context.Provider value={ctx}>{props.children}</context.Provider>
	}

	return { component, context }
}

// TODO: use non-JSX approach like with the solid-adapter
