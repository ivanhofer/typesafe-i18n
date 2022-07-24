import type { Locale } from '@typesafe-i18n/runtime/core.mjs'
import type { LocaleDetector } from '../../detect.mjs'
import { parseValueFromCookie } from '../_cookie.util.mjs'

type Request = {
	cookies: string
}

export const initRequestCookiesDetector =
	(req: Request, key = 'lang'): LocaleDetector =>
	(): Locale[] =>
		parseValueFromCookie(req?.cookies, key)
