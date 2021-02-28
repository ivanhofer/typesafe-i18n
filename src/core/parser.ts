import { isNotUndefined, isString } from 'typesafe-utils'
import { trimAllValues, removeEmptyValues } from './core-utils'

// --------------------------------------------------------------------------------------------------------------------
// types --------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------

export type TextPart = string

export type ArgumentPart = {
	k: string // key
	i?: string // type
	f?: string[] // formatterFunctionKey
}

export type PluralPart = {
	k: string // key
	z?: string // zero
	o: string // one
	t?: string // two
	f?: string // few
	m?: string // many
	r: string // other
}

export type Part = TextPart | ArgumentPart | PluralPart

// --------------------------------------------------------------------------------------------------------------------
// implementation -----------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------

const REGEX_BRACKETS_SPLIT = /({?{[^\\}]+}}?)/g

const parseArgumentPart = (text: string): ArgumentPart => {
	const [keyPart = '', ...formatterKeys] = text.split('|')

	const [key = '', type] = keyPart.split(':')
	return { k: key, i: type, f: formatterKeys } as ArgumentPart
}

const parsePluralPart = (content: string, lastAcessor: string): PluralPart => {
	let [key, values] = content.split(':') as [string, string?]
	if (!values) {
		values = key
		key = lastAcessor
	}

	const [zero, one, two, few, many, rest] = values.split('|')
	const z = (isNotUndefined(rest) && zero) || ''
	const t = (isNotUndefined(rest) && two) || ''
	const f = (isNotUndefined(rest) && few) || ''
	const m = (isNotUndefined(rest) && many) || ''
	const o = (isNotUndefined(rest) ? one : isNotUndefined(one) ? zero : one) || ''
	const r = (isNotUndefined(rest) ? rest : o ? one : zero) || ''

	return { k: key, z, o, t, f, m, r } as PluralPart
}

export const parseRawText = (rawText: string, optimize = true, firstKey = '', lastKey = ''): Part[] =>
	rawText
		.split(REGEX_BRACKETS_SPLIT)
		.filter(Boolean)
		.map((part) => {
			if (!part.match(REGEX_BRACKETS_SPLIT)) {
				return part
			}

			const content = part.substring(1, part.length - 1)
			if (content.startsWith('{') && content.endsWith('}')) {
				return parsePluralPart(content.substring(1, content.length - 1), lastKey)
			}

			const parsedPart = parseArgumentPart(content)

			lastKey = parsedPart.k || lastKey
			!firstKey && (firstKey = lastKey)

			return parsedPart
		})
		.map((part) => {
			if (isString(part)) return part

			if (!part.k) part.k = firstKey || '0'

			const trimmed = trimAllValues(part)
			return optimize ? removeEmptyValues(trimmed) : trimmed
		})
