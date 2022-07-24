import type { Locale } from '@typesafe-i18n/runtime/core.mjs'
import type { LocaleDetector } from '../../detect'

export const navigatorDetector: LocaleDetector = (): Locale[] => (navigator?.languages as Locale[]) || []
