import { isNotUndefined, isString } from 'typesafe-utils'
import { parseRawText } from './basic.mjs'
import type { Part, PluralPart } from './types.mjs'

export type ParsedMessage = ParsedMessagePart[]

type ParsedMessagePart =
	| TextPart
	| ParameterPart

type TextPart = {
	kind: 'text'
	content: string
}

type ParameterPart = {
	kind: 'parameter'
	key: string
	type: string
	optional: boolean
}

export const parseMessage = (message: string): ParsedMessage => parseRawText(message, false).map(createPart).filter(isNotUndefined)

const createPart = (part: Part): ParsedMessagePart | undefined => {
	if (isString(part)) {
		return part ? createTextPart(part) : undefined
	}

	if (!isPluralPart(part)) return createParameterPart(part.k, part.i || 'unknown', part.n || false)

	console.info(1, part);

	return undefined

}

const isPluralPart = (part: Exclude<Part, string>): part is PluralPart => !!((part as PluralPart).r)

const createTextPart = (content: string): TextPart => ({ kind: 'text', content })

const createParameterPart = (key: string, type: string, optional: boolean): ParameterPart => ({ kind: 'parameter', key, type: type, optional })
