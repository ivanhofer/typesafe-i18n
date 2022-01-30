import type { Locale } from '../../../../runtime/src/core'
import type { LocaleDetector } from '../../detect'

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
