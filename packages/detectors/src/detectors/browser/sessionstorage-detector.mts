import { isTruthy } from 'typesafe-utils'
import type { Locale } from '../../../../runtime/src/core.mjs'
import type { LocaleDetector } from '../../detect.mjs'

export const initSessionStorageDetector =
	(key = 'lang'): LocaleDetector =>
	(): Locale[] =>
		[window?.sessionStorage?.getItem(key)].filter(isTruthy)

export const sessionStorageDetector = initSessionStorageDetector()
