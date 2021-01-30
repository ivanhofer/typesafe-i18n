import type { LangaugeBaseFormatters, Cache } from './core'
import { translate } from './core'
import type { Part } from './parser'
import { parseRawText } from './parser'

type TranslateByString = ((text: string) => string) | ((text: string, ...args: unknown[]) => string)

export const getPartsFromString = (cache: Cache, text: string): Part[] =>
	cache[text] || (cache[text] = parseRawText(text))

const translateString = <F extends LangaugeBaseFormatters>(
	cache: Cache,
	pluralRules: Intl.PluralRules,
	formatters: F,
	text: string,
	...args: unknown[]
) => translate(getPartsFromString(cache, text), pluralRules, formatters, args)

export const langaugeStringWrapper = <L extends string, F extends LangaugeBaseFormatters = LangaugeBaseFormatters>(
	locale: L,
	formatters: F = {} as F,
): TranslateByString => translateString.bind(null, {}, new Intl.PluralRules(locale), formatters)
