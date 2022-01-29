import type { BaseFormatters, BaseTranslation, TranslationFunctions } from '../../runtime/src/core'
import { getFallbackProxy } from '../../runtime/src/core-utils'
import { i18nObject } from '../../runtime/src/util.object'

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
	L extends string = string,
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
