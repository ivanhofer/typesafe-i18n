import type { Locale } from '@typesafe-i18n/runtime/core.mjs'
import { isNotEmpty } from 'typesafe-utils'
import type { LocaleDetector } from '../../detect'

type ObjectWithHeaders = { headers: Record<string, string | string[] | undefined> }

const REGEX_ACCEPT_LANGUAGE_SPLIT = /;|,/

export const initAcceptLanguageHeaderDetector =
	({ headers }: ObjectWithHeaders, headerKey = 'accept-language'): LocaleDetector =>
	(): Locale[] =>
		(headers[headerKey] as string)
			?.split(REGEX_ACCEPT_LANGUAGE_SPLIT)
			.filter((part) => !part.startsWith('q'))
			.map((part) => part.trim())
			.filter((part) => part !== '*')
			.filter(isNotEmpty) || []
