import type { Locale } from 'packages/core/src/core'
import type { LocaleDetector } from '../detect'
import { parseValueFromCookie } from './_cookie.util'

export const initDocumentCookieDetector =
	(key = 'lang'): LocaleDetector =>
		(): Locale[] =>
			parseValueFromCookie(document?.cookie, key)

export const documentCookieDetector = initDocumentCookieDetector()
