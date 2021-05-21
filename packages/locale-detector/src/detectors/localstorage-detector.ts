import { isTruthy } from 'typesafe-utils'
import type { Locale } from '../../../core/src/core'
import type { LocaleDetector } from '../detect'

export const initLocalStorageDetector =
	(key = 'lang'): LocaleDetector =>
		(): Locale[] =>
			[window?.localStorage?.getItem(key)].filter(isTruthy)
