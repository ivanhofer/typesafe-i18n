import type { Locale } from '../../../../runtime/src/core.mjs'
import type { LocaleDetector } from '../../detect.mjs'

export const navigatorDetector: LocaleDetector = (): Locale[] => (navigator?.languages as Locale[]) || []
