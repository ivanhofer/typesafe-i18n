import type { Headers } from 'node-fetch'
import { isNotEmpty } from 'typesafe-utils'
import type { Locale } from '../../../core/src/core'
import type { LocaleDetector } from '../detect'

const REGEX_ACCEPT_LANGUAGE_SPLIT = /;|,/

export const initAcceptLanguageHeaderDetector =
	(headers: Headers): LocaleDetector =>
		(): Locale[] =>
			headers
				.get('Accept-Language')
				?.split(REGEX_ACCEPT_LANGUAGE_SPLIT)
				.filter((part) => !part.startsWith('q'))
				.map((part) => part.trim())
				.filter((part) => part !== '*')
				.filter(isNotEmpty) || []
