import { isTruthy } from 'typesafe-utils'
import type { Locale } from '../../../core/src/core'
import type { LocaleDetector } from '../detect'

export const initLocalStorageDetector =
	(key = 'locale'): LocaleDetector =>
		(): Locale[] =>
			[window?.localStorage?.getItem(key)].filter(isTruthy)

export const localStorageDetector = initLocalStorageDetector()
