import type { Locale } from '@typesafe-i18n/runtime/core.mjs'
import type { LocaleDetector } from '../../detect'
import { parseValueFromCookie } from '../_cookie.util'

type Request = {
	cookies: string
}

export const initRequestCookiesDetector =
	(req: Request, key = 'lang'): LocaleDetector =>
	(): Locale[] =>
		parseValueFromCookie(req?.cookies, key)
