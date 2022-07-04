import type { Locale } from '../../../../runtime/src/core'
import type { LocaleDetector } from '../../detect'

type Request = {
	hostname: string
}

export const initRequestHostnameDetector =
	(req: Request): LocaleDetector =>
	(): Locale[] => {
		const match = req?.hostname?.match(/^(?:([a-z]{2}(?:-[A-Z]{2})?)\.)/)

		if (match && match[1]) {
			return [match[1]]
		}

		return []
	}
