import { isTruthy } from 'typesafe-utils'
import type { Locale } from '../../../../runtime/src/core'
import type { LocaleDetector } from '../../detect'

export const initLocalStorageDetector =
	(key = 'lang'): LocaleDetector =>
	(): Locale[] =>
		[window?.localStorage?.getItem(key)].filter(isTruthy)

export const localStorageDetector = initLocalStorageDetector()
