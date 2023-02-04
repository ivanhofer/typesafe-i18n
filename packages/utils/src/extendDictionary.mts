import merge from 'lodash.merge'
import type { BaseTranslation } from '../../runtime/src/core.mjs'

type DeepPartial<T> = T extends BaseTranslation
	? {
			[P in keyof T]?: DeepPartial<T[P]>
	  }
	: T

type ToGenericString<T> = T extends string
	? string
	: T extends BaseTranslation
	? {
			[P in keyof T]?: ToGenericString<T[P]>
	  }
	: T

export const initExtendDictionary =
	<TranslationType extends BaseTranslation>() =>
	<Base extends BaseTranslation | TranslationType, Translation extends Base>(
		base: Base,
		part: DeepPartial<ToGenericString<Translation>>,
	): Translation =>
		merge(base, part) as Translation

export const extendDictionary = initExtendDictionary()
