import type { Locale } from '../../../../runtime/src/core.mjs'
import type { LocaleDetector } from '../../detect.mjs'

type Request = {
	hostname: string
}

// matches language tags as per RFC 5646
const REGEX_HOST_LANG = /^((?:\w{2,3}(?:-\w{3})?)(?:-\w{4})?(?:-\w{2}|-\d{3})?(?:-[\w\d]{5,8}|-\d[\w\d]{3})*)\./

export const initRequestHostnameDetector =
	(req: Request): LocaleDetector =>
	(): Locale[] => {
		const match = req?.hostname?.match(REGEX_HOST_LANG)

		if (match && match[1]) {
			return [match[1]]
		}

		return []
	}
