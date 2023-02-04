import merge from 'lodash.merge'
import type { BaseTranslation } from '../../runtime/src/core.mjs'

type DeepPartial<T> = T extends BaseTranslation
	? {
			[P in keyof T]?: DeepPartial<T[P]>
	  }
	: T

export const initExtendDictionary =
	<TranslationType extends BaseTranslation>() =>
	<Base extends BaseTranslation | TranslationType, Translation extends TranslationType>(
		base: Base,
		part: DeepPartial<Translation>,
	): Translation =>
		merge(base, part) as Translation

export const extendDictionary = initExtendDictionary()
