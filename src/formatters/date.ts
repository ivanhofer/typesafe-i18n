import type { FormatterFn } from './_types'

export const date = (
	language: string,
	options: Intl.DateTimeFormatOptions = {},
): FormatterFn<number | Date | undefined> => {
	const formatter = new Intl.DateTimeFormat(language, options)
	return (value) => formatter.format(value as Date)
}

export const time = date
