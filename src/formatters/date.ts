import type { FormatterFunction } from './_types'

export const date = (
	locale: string,
	options: Intl.DateTimeFormatOptions = {},
): FormatterFunction<number | Date | undefined> => {
	const formatter = new Intl.DateTimeFormat(locale, options)
	return (value) => formatter.format(value as Date)
}

export const time = date
