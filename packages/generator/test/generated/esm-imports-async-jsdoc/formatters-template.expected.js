// @ts-check

/**
 * @typedef { import('typesafe-i18n').FormattersInitializer<Locales, Formatters> } FormattersInitializer,
 * @typedef { import('./types.actual').Locales } Locales,
 * @typedef { import('./types.actual').Formatters } Formatters
 */

/**
 * @param { Locales } locale
 * @return { Promise<Formatters> }
 */
export const initFormatters = async (locale) => {
	/** @type { Formatters } */
	const formatters = {
		// add your formatter functions here
	}

	return formatters
}
