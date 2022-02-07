import type { FormattersInitializer } from 'typesafe-i18n'
import type { Locales, Formatters } from './types.actual'

export const initFormatters: FormattersInitializer<Locales, Formatters> = (locale: Locales) => {

	const formatters: Formatters = {
		// add your formatter functions here
	}

	return formatters
}
