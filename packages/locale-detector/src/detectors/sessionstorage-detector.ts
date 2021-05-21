import { isTruthy } from 'typesafe-utils'
import type { Locale } from '../../../core/src/core'
import type { LocaleDetector } from '../detect'

export const initSessionStorageDetector =
	(key = 'locale'): LocaleDetector =>
		(): Locale[] =>
			[window?.sessionStorage?.getItem(key)].filter(isTruthy)

export const sessionStorageDetector = initSessionStorageDetector()
