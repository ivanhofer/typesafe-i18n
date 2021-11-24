import { isTruthy } from 'typesafe-utils'
import type { Locale } from '../../../../runtime/src/core'
import type { LocaleDetector } from '../../detect'

export const htmlLangAttributeDetector: LocaleDetector = (): Locale[] =>
	[document?.documentElement?.lang as Locale].filter(isTruthy)
