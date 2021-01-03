import { removeEmptyValues } from './core-utils'

export type TextPart = string

export type InjectorPart = {
	k: string // key
	t?: string // type
	f?: string[] // formatterFunctionKey
}

export type SingularPluralPart = {
	k: string // key
	s: string // singular
	p: string // plural
}

export type Part = TextPart | InjectorPart | SingularPluralPart

const REGEX_BRACKETS_SPLIT = /({?{[^\\}]+}}?)/g

const parseTextPart = (text: string): TextPart => text

const parseInjectorPart = (text: string, optimize: boolean): InjectorPart => {
	const [keyPart = '', ...formatterKeys] = text.split('|')
	const [key = '', type] = keyPart.split(':')

	const part: InjectorPart = { k: key.trim(), t: type?.trim(), f: formatterKeys.map((f) => f.trim()) }
	return optimize ? removeEmptyValues(part) : part
}

const parseSingularPluralPart = (text: string, lastAcessor: string, optimize: boolean): SingularPluralPart => {
	const content = text.substring(1, text.length - 1)
	let [key, values] = content.split(':') as [string, string?]
	if (!values) {
		values = key
		key = lastAcessor
	}

	const [s, p] = values.split('|') as [string, string?]
	const singular = p ? s : ''
	const plural = p || s

	const part: SingularPluralPart = { k: key.trim(), s: singular.trim(), p: plural.trim() }
	return optimize ? removeEmptyValues(part) : part
}

export const parseRawText = (rawText: string, optimize = true): Part[] => {
	let lastKey = '0'

	return rawText
		.split(REGEX_BRACKETS_SPLIT)
		.filter(Boolean)
		.map((part) => {
			if (!part.match(REGEX_BRACKETS_SPLIT)) {
				return parseTextPart(part)
			}

			const content = part.substring(1, part.length - 1)
			if (content.match(REGEX_BRACKETS_SPLIT)) {
				return parseSingularPluralPart(content, lastKey, optimize)
			}

			const parsedPart = parseInjectorPart(content, optimize)

			lastKey = parsedPart.k || lastKey

			return parsedPart
		})
}
