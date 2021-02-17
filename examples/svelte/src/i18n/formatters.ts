import type { FormattersInitializer } from 'typesafe-i18n'
import { date } from 'typesafe-i18n/formatters'
import type { Locales, Formatters } from './i18n-types'

export const initFormatters: FormattersInitializer<Locales, Formatters> = (locale) => {
	const formatters: Formatters = {
		weekday: date(locale, { weekday: 'long' }),
		fallback0: (value) => value || '0',
		linkToSvelteTutorial: (link) => `<a href="${link}" target="_blank" rel="noopener noreferrer">Svelte tutorial</a>`,
	}

	return formatters
}
