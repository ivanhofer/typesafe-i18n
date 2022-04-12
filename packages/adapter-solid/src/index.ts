import { Accessor, batch, Component, createComponent, createContext, createSignal, useContext } from 'solid-js'
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
	locale: Accessor<L>
	LL: Accessor<TF>
	setLocale: (locale: L) => void
}

export type TypesafeI18nProps<L extends string> = {
	locale: L
}

export type SolidInit<
	L extends Locale = Locale,
	T extends BaseTranslation | BaseTranslation[] = BaseTranslation,
	TF extends TranslationFunctions<T> = TranslationFunctions<T>,
> = {
	TypesafeI18n: Component<TypesafeI18nProps<L>>
	useI18nContext: () => I18nContextType<L, T, TF>
}

// --------------------------------------------------------------------------------------------------------------------
// implementation -----------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------

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
		const [locale, _setLocale] = createSignal<L>(null as unknown as L)
		const [LL, setLL] = createSignal<TF>(getFallbackProxy<TF>())

		const setLocale = (newLocale: L): void => batch(() => {
			_setLocale(() => newLocale)
			setLL(() => i18nObject<L, T, TF, F>(newLocale, translations[newLocale], formatters[newLocale]))
		})

		setLocale(props.locale)

		return createComponent(I18nContext.Provider, {
			value: { locale, LL, setLocale },
			get children() { return props.children }
		})
	}

	const useI18nContext = (): I18nContextType<L, T, TF> => useContext(I18nContext)

	return { TypesafeI18n, useI18nContext }
}
