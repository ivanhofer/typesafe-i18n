import type { FormatterFunction } from '../../runtime/src/core.mjs'

export default (searchValue: string | RegExp, replaceValue: string): FormatterFunction<string> =>
	(value) =>
		value?.replace(searchValue, replaceValue)
