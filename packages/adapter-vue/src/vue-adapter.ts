import Vue from 'vue'
import type { BaseFormatters, BaseTranslation, TranslationFunctions } from '../../core/src/core'
import {
	AsyncFormattersInitializer,
	FormattersInitializer,
	TranslationLoader,
	TranslationLoaderAsync,
} from '../../core/src/util.loader'
import { i18nObject } from '../../core/src/util.object'

// --------------------------------------------------------------------------------------------------------------------
// types --------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------

export type I18nProvideType<
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

export type VueInit<L extends string = string> = {
	component: Vue.Component<TypesafeI18nProps<L>>
}

// --------------------------------------------------------------------------------------------------------------------
// implementation -----------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------

export const initI18nVue = <
	L extends string = string,
	T extends BaseTranslation = BaseTranslation,
	TF extends TranslationFunctions<T> = TranslationFunctions<T>,
	F extends BaseFormatters = BaseFormatters,
>(
	baseLocale: L = '' as L,
	getTranslationForLocale: TranslationLoader<L, T> | TranslationLoaderAsync<L, T> = () => ({} as T),
	initFormatters: FormattersInitializer<L, F> | AsyncFormattersInitializer<L, F> = () => ({} as F),
) => {
	let isLoading: boolean
	let currentLocale: L
	let LL: TF

	const component = Vue.component('TypesafeI18n', {
		props: {
			initialLocale: Object as Vue.PropType<L>,
		},
		data() {
			return {
				baseLocale,
				isLoading,
				currentLocale,
				LL,
			}
		},
		methods: {
			setLocale: async function (newLocale: L) {
				if (!newLocale || !getTranslationForLocale) return

				this.isLoading = true

				const translation = getTranslationForLocale(newLocale)
				const formatters = initFormatters(newLocale)
				this.LL = i18nObject(
					newLocale,
					translation instanceof Promise ? await translation : translation,
					formatters instanceof Promise ? await formatters : formatters,
				)

				this.currentLocale = newLocale
				this.isLoading = false
			},
		},
		mounted() {
			!this.currentLocale && !this.isLoading && this.setLocale(this.initialLocale || this.baseLocale)
		},
		provide() {
			this.setLocale
			this.isLoading
			this.currentLocale
			this.LL
		},
	})

	return { component }
}
