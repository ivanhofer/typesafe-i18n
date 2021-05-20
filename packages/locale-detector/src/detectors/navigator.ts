import type { Locale } from 'packages/core/src/core'
import type { LocaleDetector } from '../detect'

export const navigatorDetector: LocaleDetector = (): Locale[] => (navigator?.languages as Locale[]) || []
