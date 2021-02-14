import type { FormatterFunction } from './_types'

export const replace = (searchValue: string | RegExp, replaceValue: string): FormatterFunction<string> => (value) =>
	value?.replace(searchValue, replaceValue)
