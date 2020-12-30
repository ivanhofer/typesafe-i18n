import { DEFAULT_LOCALE } from '../constants/constants'
import type { FormatterFn } from '../types/types'

export const uppercase: FormatterFn<string> = (value: string): string => value?.toUpperCase()

export const lowercase: FormatterFn<string> = (value: string): string => value?.toLowerCase()

export const replace = (searchValue: string | RegExp, replaceValue: string): FormatterFn<string> => {
	return (value) => value.replace(searchValue, replaceValue)
}

export const date = (
	language: string = DEFAULT_LOCALE,
	options: Intl.DateTimeFormatOptions = {},
): FormatterFn<number | Date | undefined> => {
	const formatter = new Intl.DateTimeFormat(language, options)
	return (value) => formatter.format(value as Date)
}
