import type { Locale } from '@typesafe-i18n/runtime/core.mjs'
import { isTruthy } from 'typesafe-utils'
import type { LocaleDetector } from '../../detect.mjs'

export const initSessionStorageDetector =
	(key = 'lang'): LocaleDetector =>
	(): Locale[] =>
		[window?.sessionStorage?.getItem(key)].filter(isTruthy)

export const sessionStorageDetector = initSessionStorageDetector()
