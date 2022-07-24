import type { Locale } from '../../../../runtime/src/core.mjs'
import type { LocaleDetector } from '../../detect.mjs'
import { parseValueFromCookie } from '../_cookie.util.mjs'

type Request = {
	cookies: string
}

export const initRequestCookiesDetector =
	(req: Request, key = 'lang'): LocaleDetector =>
	(): Locale[] =>
		parseValueFromCookie(req?.cookies, key)
