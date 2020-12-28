import { REGEX_BRACKETS_SPLIT } from '../constants'
import { TextPart, InjectorPart, SingularPluralPart, Part } from '../types'
import { removeEmptyValues } from '../utils'

const parseTextPart = (text: string): TextPart => text

const parseInjectorPart = (text: string): InjectorPart => {
	const [key = '', ...formatterKeys] = text.split('|')

	return removeEmptyValues({ k: key, f: formatterKeys })
}

const parseSingularPluralPart = (text: string, lastAcessor: string): Partial<SingularPluralPart> => {
	const content = text.substring(1, text.length - 1)
	const [key = lastAcessor, values = key] = content.split(':') as [string, string?]

	const [s, p] = values.split('|')
	const singular = p ? s : ''
	const plural = p || s

	return removeEmptyValues({ k: key, s: singular, p: plural })
}

export const parseRawText = (rawText: string): Part[] => {
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
				return parseSingularPluralPart(content, lastKey)
			}

			const parsedPart = parseInjectorPart(content)
			lastKey = parsedPart.k

			return parsedPart
		})
}
