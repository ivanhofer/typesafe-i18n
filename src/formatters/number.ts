import type { FormatterFn } from './_types'

export const number = (locale: string, options: Intl.NumberFormatOptions = {}): FormatterFn<number | bigint> => {
	const formatter = new Intl.NumberFormat(locale, options)
	return (value) => formatter.format(value)
}
