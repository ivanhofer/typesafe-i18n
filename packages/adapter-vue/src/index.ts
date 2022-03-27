import type { App, inject, InjectionKey, Ref, ref } from 'vue'
import type { BaseFormatters, BaseTranslation, Locale, TranslationFunctions } from '../../runtime/src/core'
import { getFallbackProxy } from '../../runtime/src/core-utils'
import { i18nObject } from '../../runtime/src/util.object'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const wrapProxy = <TF extends TranslationFunctions<any>>(proxy: TF): TF =>
	new Proxy(proxy, {
		get: (_target, key) => !(typeof key !== 'string' || key.startsWith('__v_')) && _target[key],
	})

type Provider<L extends string, T extends BaseTranslation | BaseTranslation[], TF extends TranslationFunctions<T>> = {
	locale: Ref<L>
	LL: Ref<TF>
	setLocale: (locale: L) => void
}

type I18nPlugin<L extends string> = {
	install: (app: App, locale: L) => void
}

export type VuePluginInit<
	L extends Locale = Locale,
	T extends BaseTranslation | BaseTranslation[] = BaseTranslation,
	TF extends TranslationFunctions<T> = TranslationFunctions<T>,
> = {
	typesafeI18n: () => Provider<L, T, TF>
	i18nPlugin: I18nPlugin<L>
}

export const initI18nVuePlugin = <
	L extends Locale = Locale,
	T extends BaseTranslation | BaseTranslation[] = BaseTranslation,
	TF extends TranslationFunctions<T> = TranslationFunctions<T>,
	F extends BaseFormatters = BaseFormatters,
>(
	vueInject: typeof inject,
	vueRef: typeof ref,
	translations: Record<L, T>,
	formatters: Record<L, F> = {} as Record<L, F>,
): VuePluginInit<L, T, TF> => {
	const i18nKey: InjectionKey<Provider<L, T, TF>> = Symbol('typesafe-i18n')

	const typesafeI18n: () => Provider<L, T, TF> = () => vueInject(i18nKey) as Provider<L, T, TF>

	const i18nPlugin: I18nPlugin<L> = {
		install: (app: App, locale: L) => {
			const localeRef: Ref<L> = vueRef(locale) as Ref<L>
			const LLref: Ref<TF> = vueRef(wrapProxy(getFallbackProxy())) as Ref<TF>

			const setLocale = (newLocale: L) => {
				localeRef.value = newLocale
				LLref.value = wrapProxy(i18nObject<L, T, TF, F>(newLocale, translations[newLocale], formatters[newLocale]))
			}

			setLocale(locale)

			app.provide(i18nKey, {
				locale: localeRef,
				LL: LLref,
				setLocale: setLocale,
			})
		},
	}

	return { typesafeI18n, i18nPlugin }
}
