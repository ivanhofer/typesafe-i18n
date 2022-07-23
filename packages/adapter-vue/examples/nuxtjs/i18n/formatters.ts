import type { FormattersInitializer } from 'typesafe-i18n'
import { date } from 'typesafe-i18n/formatters'
import type { Formatters, Locales } from './i18n-types'

export const initFormatters: FormattersInitializer<Locales, Formatters> = (locale: Locales) => {
	const formatters: Formatters = {
		weekday: date(locale, { weekday: 'long' }),
	}

	return formatters
}
