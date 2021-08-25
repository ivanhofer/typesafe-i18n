import type { FormatterFunction } from '../../core/src/core'

export default (locale: string, options: Intl.NumberFormatOptions = {}): FormatterFunction<number | bigint, string> => {
	const formatter = new Intl.NumberFormat(locale, options)
	return (value) => formatter.format(value)
}
