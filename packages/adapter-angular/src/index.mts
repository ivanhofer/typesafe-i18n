import { getFallbackProxy } from '@typesafe-i18n/runtime/core-utils.mjs'
import type { BaseFormatters, BaseTranslation, Locale, TranslationFunctions } from '@typesafe-i18n/runtime/core.mjs'
import { i18nObject } from '@typesafe-i18n/runtime/util.object.mjs'

const wrapProxy = <
	T extends BaseTranslation | BaseTranslation[] = BaseTranslation,
	TF extends TranslationFunctions<T> = TranslationFunctions<T>,
>(
	proxyObject: TF,
): TF =>
	new Proxy(proxyObject as TF, {
		get: (target, key: string) =>
			!(target === proxyObject && key === 'then') && proxyObject[key as keyof typeof proxyObject],
	})

export class I18nServiceRoot<
	L extends Locale = Locale,
	T extends BaseTranslation | BaseTranslation[] = BaseTranslation,
	TF extends TranslationFunctions<T> = TranslationFunctions<T>,
	F extends BaseFormatters = BaseFormatters,
> {
	#locale: L = null as unknown as L
	#LL: TF = wrapProxy(getFallbackProxy<TF>())

	constructor(private translations: Record<L, T>, private formatters: Record<L, F>) {}

	get locale(): L {
		return this.#locale
	}

	get LL(): TF {
		return this.#LL
	}

	setLocale(newLocale: L): void {
		this.#locale = newLocale
		this.#LL = wrapProxy(i18nObject<L, T, TF, F>(newLocale, this.translations[newLocale], this.formatters[newLocale]))
	}
}
