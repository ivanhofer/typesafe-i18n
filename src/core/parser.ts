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

	const [z, o, t, f, m, r] = values.split('|') as [string, string?, string?, string?, string?, string?]
	const zero = (r && z) || ''
	const one = (r ? o : o && z) || ''
	const two = (r && t) || ''
	const few = (r && f) || ''
	const many = (r && m) || ''
	const other = r || o || z

	const part: PluralPart = trimAllValues({ k: key, z: zero, o: one, t: two, f: few, m: many, r: other })

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
