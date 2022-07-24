import type { Locale } from '@typesafe-i18n/runtime/core.mjs'
import type { LocaleDetector } from '../../detect.mjs'

export const initQueryStringDetector =
	(key = 'lang'): LocaleDetector =>
	(): Locale[] => {
		const value = location?.search
			?.slice(1)
			.split('&')
			.find((part) => part.startsWith(key))
			?.split('=')[1]

		return value ? [value] : []
	}

export const queryStringDetector = initQueryStringDetector()
