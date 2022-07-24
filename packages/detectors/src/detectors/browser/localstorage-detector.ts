import type { Locale } from '@typesafe-i18n/runtime/core.mjs'
import { isTruthy } from 'typesafe-utils'
import type { LocaleDetector } from '../../detect'

export const initLocalStorageDetector =
	(key = 'lang'): LocaleDetector =>
	(): Locale[] =>
		[window?.localStorage?.getItem(key)].filter(isTruthy)

export const localStorageDetector = initLocalStorageDetector()
