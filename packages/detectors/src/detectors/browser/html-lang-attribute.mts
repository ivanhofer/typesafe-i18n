import { isTruthy } from 'typesafe-utils'
import type { Locale } from '../../../../runtime/src/core.mjs'
import type { LocaleDetector } from '../../detect.mjs'

export const htmlLangAttributeDetector: LocaleDetector = (): Locale[] =>
	[document?.documentElement?.lang as Locale].filter(isTruthy)
