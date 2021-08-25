import { Request } from 'express'
import { isTruthy } from 'typesafe-utils'
import type { Locale } from '../../../../core/src/core'
import type { LocaleDetector } from '../../detect'

export const initRequestParametersDetector =
	(req: Request, key = 'lang'): LocaleDetector =>
	(): Locale[] =>
		[req?.params?.[key]].filter(isTruthy)
