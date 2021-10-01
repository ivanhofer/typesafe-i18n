import { removeEmptyValues, trimAllValues } from './core-utils'

// --------------------------------------------------------------------------------------------------------------------
// types --------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------

export type TextPart = string

export type ArgumentPart = {
	k: string // key
	i?: string // type
	n?: boolean // non-mandatory (optional)
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

	const [keyWithoutType = '', type] = keyPart.split(':')
	const [key, isOptional] = keyWithoutType.split('?') as [string, string | undefined]
	return { k: key, i: type, n: isOptional !== '', f: formatterKeys }
}

const parsePluralPart = (content: string, lastAccessor: string): PluralPart => {
	let [key, values] = content.split(':') as [string, string?]
	if (!values) {
		values = key
		key = lastAccessor
	}

	const entries = values.split('|')
	const [zero, one, two, few, many, rest] = entries

	const nrOfEntries = entries.filter((entry) => entry !== undefined).length

	if (nrOfEntries === 1) {
		return { k: key, r: zero } as PluralPart
	}
	if (nrOfEntries === 2) {
		return { k: key, o: zero, r: one } as PluralPart
	}
	if (nrOfEntries === 3) {
		return { k: key, z: zero, o: one, r: two } as PluralPart
	}

	return { k: key, z: zero, o: one, t: two, f: few, m: many, r: rest } as PluralPart
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
			if (typeof part === 'string') return part

			if (!part.k) part.k = firstKey || '0'

			const trimmed = trimAllValues(part)
			return optimize ? removeEmptyValues(trimmed) : trimmed
		})
