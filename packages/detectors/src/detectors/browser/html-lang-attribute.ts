import type { Locale } from '@typesafe-i18n/runtime/core.mjs'
import { isTruthy } from 'typesafe-utils'
import type { LocaleDetector } from '../../detect'

export const htmlLangAttributeDetector: LocaleDetector = (): Locale[] =>
	[document?.documentElement?.lang as Locale].filter(isTruthy)
