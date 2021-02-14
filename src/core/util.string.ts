import type { Arguments, BaseFormatters, Cache, Locale } from './core'
import { translate } from './core'
import type { Part } from './parser'
import { parseRawText } from './parser'

type TranslateByString = ((text: string) => string) | ((text: string, ...args: Arguments) => string)

export const getPartsFromString = (cache: Cache, text: string): Part[] =>
	cache[text] || (cache[text] = parseRawText(text))

const translateString = <F extends BaseFormatters>(
	cache: Cache,
	pluralRules: Intl.PluralRules,
	formatters: F,
	text: string,
	...args: Arguments
) => translate(getPartsFromString(cache, text), pluralRules, formatters, args)

export const i18nString = <L extends Locale, F extends BaseFormatters>(
	locale: L,
	formatters: F = {} as F,
): TranslateByString => translateString.bind(null, {}, new Intl.PluralRules(locale), formatters)
