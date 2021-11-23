import type { BaseFormatters, BaseTranslation, TranslationFunctions } from '../../runtime/src/core'
import { getFallbackProxy } from '../../runtime/src/core-utils'
import type {
	AsyncFormattersInitializer,
	FormattersInitializer,
	TranslationLoader,
	TranslationLoaderAsync,
} from '../../runtime/src/util.loader'
import { i18nObject } from '../../runtime/src/util.object'

export class I18nServiceRoot<
	L extends string = string,
	T extends BaseTranslation | BaseTranslation[] = BaseTranslation,
	TF extends TranslationFunctions<T> = TranslationFunctions<T>,
	F extends BaseFormatters = BaseFormatters,
> {
	private _isLoadingLocale = false
	private currentLocale: L = null as unknown as L
	private _LL: TF | null = getFallbackProxy<TF>()

	constructor(
		private baseLocale: L = '' as L,
		private getTranslationForLocale: TranslationLoader<L, T> | TranslationLoaderAsync<L, T> = () => ({} as T),
		private initFormatters: FormattersInitializer<L, F> | AsyncFormattersInitializer<L, F> = () => ({} as F),
	) {}

	async initI18n(locale: L = this.baseLocale): Promise<void> {
		await this.setLocale(locale)
	}

	get isLoadingLocale(): boolean {
		return this._isLoadingLocale
	}

	get LL(): TF {
		return this._LL as TF
	}

	get locale(): L {
		return this.currentLocale
	}

	async setLocale(newLocale: L): Promise<void> {
		const translation = this.getTranslationForLocale(newLocale)
		const formatters = this.initFormatters(newLocale)
		this._LL = i18nObject<L, T, TF, F>(
			newLocale,
			translation instanceof Promise ? await translation : translation,
			formatters instanceof Promise ? await formatters : formatters,
		)
		this.currentLocale = newLocale
	}
}
