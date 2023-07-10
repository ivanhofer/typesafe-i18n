import type ReactImportType from 'react'
import ReactImport from 'react'
import { getFallbackProxy } from '../../runtime/src/core-utils.mjs'
import type { BaseFormatters, BaseTranslation, Locale, TranslationFunctions } from '../../runtime/src/core.mjs'
import { i18nObject } from '../../runtime/src/util.object.mjs'

const React = ReactImport as unknown as typeof ReactImportType

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
	children: React.ReactNode
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
		const [locale, setLocale] = React.useState<L>(props.locale)

		const ctx = React.useMemo<I18nContextType<L, T, TF>>(
			() => ({
				setLocale,
				locale,
				LL: !locale
					? getFallbackProxy<TF>()
					: i18nObject<L, T, TF, F>(locale, translations[locale], formatters[locale]),
			}),
			[setLocale, locale, translations, formatters],
		)

		return <context.Provider value={ctx}>{props.children}</context.Provider>
	}

	return { component, context }
}

// TODO: use non-JSX approach like with the solid-adapter
