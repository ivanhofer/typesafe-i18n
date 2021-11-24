import type { Locale } from '../../../../runtime/src/core'
import type { LocaleDetector } from '../../detect'

export const navigatorDetector: LocaleDetector = (): Locale[] => (navigator?.languages as Locale[]) || []
