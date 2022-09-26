import { isNotEmpty } from 'typesafe-utils'
import type { Locale } from '../../../../runtime/src/core.mjs'
import type { LocaleDetector } from '../../detect.mjs'

type ObjectWithHeaders = { headers: { get: (key: string) => string | null } }

const REGEX_ACCEPT_LANGUAGE_SPLIT = /;|,/

export const initAcceptLanguageHeaderDetector =
	({ headers }: ObjectWithHeaders, headerKey = 'accept-language'): LocaleDetector =>
	(): Locale[] =>
		(headers.get(headerKey) as string)
			?.split(REGEX_ACCEPT_LANGUAGE_SPLIT)
			.filter((part) => !part.startsWith('q'))
			.map((part) => part.trim())
			.filter((part) => part !== '*')
			.filter(isNotEmpty) || []
