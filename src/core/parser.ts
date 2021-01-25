import { isNotUndefined } from 'typesafe-utils'
import { trimAllValues, removeEmptyValues } from './core-utils'

// --------------------------------------------------------------------------------------------------------------------
// types --------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------

export type TextPart = string

export type InjectorPart = {
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

export type Part = TextPart | InjectorPart | PluralPart

// --------------------------------------------------------------------------------------------------------------------
// implementation -----------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------

const REGEX_BRACKETS_SPLIT = /({?{[^\\}]+}}?)/g

const parseInjectorPart = (text: string, optimize: boolean): InjectorPart => {
	const [keyPart = '', ...formatterKeys] = text.split('|')
	const [key = '', type] = keyPart.split(':')

	const part: InjectorPart = trimAllValues({ k: key, i: type, f: formatterKeys })
	return optimize ? removeEmptyValues(part) : part
}

const parseSingularPluralPart = (content: string, lastAcessor: string, optimize: boolean): PluralPart => {
	let [key, values] = content.split(':') as [string, string?]
	if (!values) {
		values = key
		key = lastAcessor
	}

	const [zero, one, two, few, many, rest] = values.split('|')
	const o = (isNotUndefined(rest) ? one : isNotUndefined(one) ? zero : one) || ''
	const z = (isNotUndefined(rest) && zero) || ''
	const t = (isNotUndefined(rest) && two) || ''
	const f = (isNotUndefined(rest) && few) || ''
	const m = (isNotUndefined(rest) && many) || ''
	const r = (isNotUndefined(rest) ? rest : o ? one : zero) || ''

	const part: PluralPart = trimAllValues({ k: key, z, o, t, f, m, r })

	return optimize ? removeEmptyValues(part) : part
}

export const parseRawText = (rawText: string, optimize = true): Part[] => {
	let lastKey = '0'

	return rawText
		.split(REGEX_BRACKETS_SPLIT)
		.filter(Boolean)
		.map((part) => {
			if (!part.match(REGEX_BRACKETS_SPLIT)) {
				return part
			}

			const content = part.substring(1, part.length - 1)
			if (content.match(REGEX_BRACKETS_SPLIT)) {
				return parseSingularPluralPart(content.substring(1, content.length - 1), lastKey, optimize)
			}

			const parsedPart = parseInjectorPart(content, optimize)

			lastKey = parsedPart.k || lastKey

			return parsedPart
		})
}
