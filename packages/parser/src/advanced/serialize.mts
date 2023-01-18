import { isPluralPart, isTextPart } from './parse.mjs'
import type { ParameterPart, ParsedMessage, ParsedMessagePart, PluralPart } from './types.mjs'

export const serializeMessage = (parts: ParsedMessage) => parts.map(serializePart).join('')

const serializePart = (part: ParsedMessagePart) => {
	if (isTextPart(part)) return part.content

	if (isPluralPart(part)) return serializePluralPart(part)

	return serializeParameterPart(part)
}

const serializePluralPart = ({ key, zero, one, two, few, many, other }: PluralPart) => {
	return ''
}

const serializeParameterPart = ({ key, optional, types, transforms }: ParameterPart) => {
	return ''
}
