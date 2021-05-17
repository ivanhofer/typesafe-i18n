import type { FormatterFunction } from '../../core/src/core'

export const replace =
	(searchValue: string | RegExp, replaceValue: string): FormatterFunction<string> =>
		(value) =>
			value?.replace(searchValue, replaceValue)
