import type { AsyncFormattersInitializer } from 'typesafe-i18n'
import type { Locales, Formatters } from './i18n-types'

export const initFormatters: AsyncFormattersInitializer<Locales, Formatters> = async (locale: Locales) => {
	
	const formatters: Formatters = {
		// add your formatter functions here
	}

	return formatters
}
