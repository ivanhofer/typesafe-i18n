import type { App, inject, InjectionKey, Ref, ref } from 'vue'
import type { BaseFormatters, BaseTranslation, TranslationFunctions } from '../../runtime/src/core'
import { getFallbackProxy } from '../../runtime/src/core-utils'
import type {
	AsyncFormattersInitializer,
	FormattersInitializer,
	TranslationLoader,
	TranslationLoaderAsync,
} from '../../runtime/src/util.loader'
import { i18nObject } from '../../runtime/src/util.object'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const wrapProxy = <TF extends TranslationFunctions<any>>(proxy: TF): TF =>
	new Proxy(proxy, {
		get: (_target, key) => !(typeof key !== 'string' || key.startsWith('__v_')) && _target[key],
	})

type Provider<L extends string, T extends BaseTranslation | BaseTranslation[], TF extends TranslationFunctions<T>> = {
	setLocale: (locale: L) => Promise<void>
	isLoadingLocale: Ref<boolean>
	locale: Ref<L>
	LL: Ref<TF>
}

type I18nPlugin<L extends string> = {
	install: (app: App, locale?: L) => void
}

export type VuePluginInit<
	L extends string = string,
	T extends BaseTranslation | BaseTranslation[] = BaseTranslation,
	TF extends TranslationFunctions<T> = TranslationFunctions<T>,
> = {
	i18n: () => Provider<L, T, TF>
	plugin: I18nPlugin<L>
}

export const initI18nVuePlugin = <
	L extends string = string,
	T extends BaseTranslation | BaseTranslation[] = BaseTranslation,
	TF extends TranslationFunctions<T> = TranslationFunctions<T>,
	F extends BaseFormatters = BaseFormatters,
>(
	vueInject: typeof inject,
	vueRef: typeof ref,
	baseLocale: L = '' as L,
	getTranslationForLocaleCallback: TranslationLoader<L, T> | TranslationLoaderAsync<L, T>,
	initFormattersCallback?: FormattersInitializer<L, F> | AsyncFormattersInitializer<L, F>,
): VuePluginInit<L, T, TF> => {
	const i18nKey: InjectionKey<Provider<L, T, TF>> = Symbol('i18n')

	const i18n: () => Provider<L, T, TF> = () => vueInject(i18nKey) as Provider<L, T, TF>

	const getTranslationForLocale = getTranslationForLocaleCallback
	const initFormatters = initFormattersCallback || (() => ({} as F))

	const plugin: I18nPlugin<L> = {
		install: (app: App, locale?: L) => {
			const LLref: Ref<TF> = vueRef(wrapProxy(getFallbackProxy())) as Ref<TF>
			const isLoadingLocaleRef: Ref<boolean> = vueRef(true)
			const localeRef: Ref<L> = vueRef(locale) as Ref<L>

			const init = async (locale: L) => {
				isLoadingLocaleRef.value = true

				const translations = await getTranslationForLocale(locale)
				const formatters = await initFormatters(locale)

				const LL = i18nObject<L, T, TF, F>(locale, translations, formatters)
				LLref.value = wrapProxy(LL)
				localeRef.value = locale
				isLoadingLocaleRef.value = false
			}

			init(locale || baseLocale)

			app.provide(i18nKey, {
				setLocale: init,
				isLoadingLocale: isLoadingLocaleRef,
				locale: localeRef,
				LL: LLref,
			})
		},
	}

	return { i18n, plugin }
}
