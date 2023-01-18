import { isParameterPart, isPluralPart, isTextPart } from './parse.mjs'
import type { ParameterPart, ParsedMessage, ParsedMessagePart, PluralPart, TransformParameterPart } from './types.mjs'

// TODO: maybe add a spacing:boolean option to control if `{name:string|uppercase}` or ` {name: string | uppercase }` should be emitted
export const serializeMessage = (parts: ParsedMessage) => parts.map(serializePart).join('')

export const serializeMessageWithoutTypes = (parts: ParsedMessage) =>
	serializeMessage(parts.map((part) => (isParameterPart(part) ? { ...part, types: [] } : part)))

const serializePart = (part: ParsedMessagePart) => {
	if (isTextPart(part)) return part.content

	if (isPluralPart(part)) return serializePluralPart(part)

	return serializeParameterPart(part)
}

export const serializePluralPart = ({ zero, one, two, few, many, other }: PluralPart) =>
	`{{${[zero, one, two, few, many, other].filter((value) => value !== undefined).join('|')}}}`

const serializeParameterPart = ({ key, optional, types, transforms }: ParameterPart) => {
	const type = types.length === 1 ? (types[0] === 'unknown' ? undefined : types[0]) : undefined
	return `{${key}${type ? `:${type}` : ''}${optional ? '?' : ''}${
		transforms.length ? `|${transforms.map(serializeTransformPartAsString).join('|')}` : ''
	}}`
}

export const serializeTransformPartAsString = (transform: TransformParameterPart) =>
	transform.kind === 'formatter' ? transform.name : transform.raw // TODO:
