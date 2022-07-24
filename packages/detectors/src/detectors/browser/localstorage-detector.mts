import { isTruthy } from 'typesafe-utils'
import type { Locale } from '../../../../runtime/src/core.mjs'
import type { LocaleDetector } from '../../detect.mjs'

export const initLocalStorageDetector =
	(key = 'lang'): LocaleDetector =>
	(): Locale[] =>
		[window?.localStorage?.getItem(key)].filter(isTruthy)

export const localStorageDetector = initLocalStorageDetector()
