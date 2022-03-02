import { isTruthy } from 'typesafe-utils'
import type { Locale } from '../../../../runtime/src/core'
import type { LocaleDetector } from '../../detect'

type Request = {
	params: Record<string, string>
}

export const initRequestParametersDetector =
	(req: Request, key = 'lang'): LocaleDetector =>
	(): Locale[] =>
		[req?.params?.[key]].filter(isTruthy)
