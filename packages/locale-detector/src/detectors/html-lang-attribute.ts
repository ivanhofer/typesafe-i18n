import type { Locale } from 'packages/core/src/core'
import { isTruthy } from 'typesafe-utils'
import type { LocaleDetector } from '../detect'

export const htmlLangAttributeDetector: LocaleDetector = (): Locale[] =>
	[document?.documentElement?.lang as Locale].filter(isTruthy)
