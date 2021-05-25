import type { Locale } from '../../../../core/src/core'
import { isTruthy } from 'typesafe-utils'
import type { LocaleDetector } from '../../detect'

export const htmlLangAttributeDetector: LocaleDetector = (): Locale[] =>
	[document?.documentElement?.lang as Locale].filter(isTruthy)
