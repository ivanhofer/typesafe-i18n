import { Injectable } from '@angular/core';
import { Locales, TranslationFunctions } from 'src/i18n/i18n-types';
import { i18nObject } from 'src/i18n/i18n-util';

@Injectable({
	providedIn: 'root'
})
export class I18nService {
	private _isLoadingLocale = false
	private currentLocale: Locales = null as unknown as Locales
	private _LL: TranslationFunctions | null = getFallbackProxy<TranslationFunctions>()

	async initI18n(locale: Locales): Promise<void> {
		await this.setLocale(locale)
	}

	get isLoadingLocale(): boolean {
		return this._isLoadingLocale
	}

	get LL(): TranslationFunctions {
		return this._LL as TranslationFunctions
	}

	get locale(): Locales {
		return this.currentLocale
	}

	async setLocale(locale: Locales): Promise<void> {
		this._LL = await i18nObject(locale)
		this.currentLocale = locale
	}
}

const getFallbackProxy = <TF extends TranslationFunctions>(prefixKey?: string): TF =>
	new Proxy((prefixKey ? (() => prefixKey) : {}) as TF, {
		get: (_target, key: string) => getFallbackProxy(prefixKey ? `${prefixKey}.${key}` : key),
	})