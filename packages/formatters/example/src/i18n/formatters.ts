import type { FormattersInitializer } from 'typesafe-i18n'
import { date, identity, ignore, lowercase, number, replace, time, uppercase } from 'typesafe-i18n/formatters'
import type { Formatters, Locales } from './i18n-types'

export const initFormatters: FormattersInitializer<Locales, Formatters> = (locale: Locales) => {
	const formatters: Formatters = {
		custom: (value) => (value * 4.2) - 7,
		sqrt: (value) => Math.sqrt(value),
		round: (value) => Math.round(value),
		weekday: date(locale, { weekday: 'long' }),
		timeShort: time(locale, { timeStyle: 'short' }),
		currency: number(locale, { style: 'currency', currency: 'EUR' }),
		noSpaces: replace(/\s/g, '-'),
		myFormatter: locale === 'en' ? identity : ignore,
		upper: uppercase,
		lower: lowercase
	}

	return formatters
}
