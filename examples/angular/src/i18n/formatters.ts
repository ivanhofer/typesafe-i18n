import type { AsyncFormattersInitializer } from 'typesafe-i18n'
import { date } from 'typesafe-i18n/formatters'
import type { Formatters, Locales } from './i18n-types'

export const initFormatters: AsyncFormattersInitializer<Locales, Formatters> = async (locale: Locales) => {
	const formatters: Formatters = {
		weekday: date(locale)
	}

	return formatters
}
