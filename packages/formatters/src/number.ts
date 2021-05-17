import type { FormatterFunction } from './_types'

export const number = (
	locale: string,
	options: Intl.NumberFormatOptions = {},
): FormatterFunction<number | bigint, string> => {
	const formatter = new Intl.NumberFormat(locale, options)
	return (value) => formatter.format(value)
}
