import type { FormatterFunction } from '../../runtime/src/core'

export default (locale: string, options: Intl.NumberFormatOptions = {}): FormatterFunction<number | bigint, string> => {
	const formatter = new Intl.NumberFormat(locale, options)
	return (value) => formatter.format(value)
}
