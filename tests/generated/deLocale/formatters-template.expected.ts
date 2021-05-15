import type { AsyncFormattersInitializer } from 'typesafe-i18n'
import type { Locales, Formatters } from './types.actual'

export const initFormatters: AsyncFormattersInitializer<Locales, Formatters> = async (locale) => {
	const formatters: Formatters = {
		// add your formatter functions here
	}

	return formatters
}
