import type { FormatterFn } from './_types'

export const replace = (searchValue: string | RegExp, replaceValue: string): FormatterFn<string> => {
	return (value) => value.replace(searchValue, replaceValue)
}
