import type { ArgumentPart, Part, PluralPart } from './types.mjs'

// --------------------------------------------------------------------------------------------------------------------

// eslint-disable-next-line prettier/prettier
const removeEmptyValues = <T extends ArgumentPart | PluralPart>(object: T): T =>
	Object.fromEntries(
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(Object.entries(object) as [string, any][])
			.map(([key, value]) => key !== 'i' && value && value != '0' && [key, value])
			.filter(Boolean),
	) as T

// --------------------------------------------------------------------------------------------------------------------

const trimAllValues = <T extends ArgumentPart | PluralPart>(part: T): T =>
	Object.fromEntries(
		Object.keys(part).map((key) => {
			const val = part[key as keyof T] as unknown as boolean | string | string[]
			return [
				key,
				Array.isArray(val) ? val.map((v) => v?.trim()) : val === !!val ? val : (val as string)?.trim(),
			] as const
		}),
	) as T

// --------------------------------------------------------------------------------------------------------------------

const parseArgumentPart = (text: string): ArgumentPart => {
	const [keyPart = '', ...formatterKeys] = text.split('|')

	const [keyWithoutType = '', type] = keyPart.split(':')
	const [key, isOptional] = keyWithoutType.split('?') as [string, string | undefined]
	return { k: key, i: type, n: isOptional === '', f: formatterKeys }
}

// --------------------------------------------------------------------------------------------------------------------

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

// --------------------------------------------------------------------------------------------------------------------

export const REGEX_SWITCH_CASE = /^\{.*\}$/

export const parseCases = (text: string): Record<string, string> => Object.fromEntries(
	removeOuterBrackets(text)
		.split(',')
		.map((part) => part.split(':'))
		.reduce((accumulator, entry) => {
			if (entry.length === 2) {
				return [...accumulator, entry.map((entry) => entry.trim()) as [string, string]]
			}

			// if we have a single part, this means that a comma `,` was present in the string and we need to combine the strings again
			; (accumulator[accumulator.length - 1] as [string, string])[1] += ',' + entry[0]
			return accumulator
		}, [] as ([string, string] | [string])[]),
)

// --------------------------------------------------------------------------------------------------------------------

const REGEX_BRACKETS_SPLIT = /(\{(?:[^{}]+|\{(?:[^{}]+)*\})*\})/g

export const removeOuterBrackets = (text: string) => text.substring(1, text.length - 1)

export const parseRawText = (rawText: string, optimize = true, firstKey = '', lastKey = ''): Part[] =>
	rawText
		.split(REGEX_BRACKETS_SPLIT)
		.map((part) => {
			if (!part.match(REGEX_BRACKETS_SPLIT)) {
				return part
			}

			const content = removeOuterBrackets(part)
			if (content.startsWith('{')) {
				return parsePluralPart(removeOuterBrackets(content), lastKey)
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
