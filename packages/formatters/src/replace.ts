import type { FormatterFunction } from '@typesafe-i18n/runtime/core.mjs'

export default (searchValue: string | RegExp, replaceValue: string): FormatterFunction<string> =>
	(value) =>
		value?.replace(searchValue, replaceValue)
