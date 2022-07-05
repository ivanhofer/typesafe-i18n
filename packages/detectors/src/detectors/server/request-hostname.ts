import type { Locale } from '../../../../runtime/src/core'
import type { LocaleDetector } from '../../detect'

type Request = {
	hostname: string
}

const HOST_LANG_REGEX = /^((?:\w{2,3}(?:-\w{3})?)(?:-\w{4})?(?:-\w{2}|-\d{3})?(?:-[\w\d]{5,8}|-\d[\w\d]{3})*)\./

export const initRequestHostnameDetector =
	(req: Request): LocaleDetector =>
	(): Locale[] => {
		const match = req?.hostname?.match(HOST_LANG_REGEX)

		if (match && match[1]) {
			return [match[1]]
		}

		return []
	}
