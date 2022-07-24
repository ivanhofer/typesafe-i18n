import type { FormatterFunction } from '@typesafe-i18n/runtime/core.mjs'

export default (
	locale: string,
	options: Intl.DateTimeFormatOptions = {},
): FormatterFunction<number | Date | undefined, string> => {
	const formatter = new Intl.DateTimeFormat(locale, options)
	return (value) => formatter.format(value as Date)
}
