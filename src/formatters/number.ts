import type { FormatterFn } from './_types'

export const number = (language: string, options: Intl.NumberFormatOptions = {}): FormatterFn<number | bigint> => {
	const formatter = new Intl.NumberFormat(language, options)
	return (value) => formatter.format(value)
}
