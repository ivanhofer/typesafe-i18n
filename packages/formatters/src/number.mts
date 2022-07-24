import type { FormatterFunction } from '@typesafe-i18n/runtime/core.mjs'

export default (locale: string, options: Intl.NumberFormatOptions = {}): FormatterFunction<number | bigint, string> => {
	const formatter = new Intl.NumberFormat(locale, options)
	return (value) => formatter.format(value)
}
