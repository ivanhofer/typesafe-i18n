import type { Locale } from '../../../../runtime/src/core.mjs'
import type { LocaleDetector } from '../../detect.mjs'
import { parseValueFromCookie } from '../_cookie.util.mjs'

export const initDocumentCookieDetector =
	(key = 'lang'): LocaleDetector =>
	(): Locale[] =>
		parseValueFromCookie(document?.cookie, key)

export const documentCookieDetector = initDocumentCookieDetector()
