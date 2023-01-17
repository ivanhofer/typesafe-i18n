import { isNotUndefined, isString } from 'typesafe-utils'
import { parseRawText } from './basic.mjs'
import type { ArgumentPart, Part, PluralPart as BasePluralPart } from './types.mjs'

export type ParsedMessage = ParsedMessagePart[]

type ParsedMessagePart =
	| TextPart
	| PluralPart
	| ParameterPart

type TextPart = {
	kind: 'text'
	content: string
}

type PluralPart = {
	kind: 'plural'
	key: string
	zero?: string
	one: string
	two?: string
	few?: string
	many?: string
	other: string
}

type ParameterPart = {
	kind: 'parameter'
	key: string
	type: string
	optional: boolean
}

// TODO: use `parseTranslationEntry` to improve types
export const parseMessage = (message: string): ParsedMessage => parseRawText(message, false).map(createPart).filter(isNotUndefined)

const createPart = (part: Part): ParsedMessagePart | undefined => {
	if (isString(part)) {
		return part ? createTextPart(part) : undefined
	}

	if (isPluralPart(part))
		return createPluralPart(part)

	return createParameterPart(part)
}

const isPluralPart = (part: Exclude<Part, string>): part is BasePluralPart => !!((part as BasePluralPart).o || (part as BasePluralPart).r)

const createTextPart = (content: string): TextPart => ({
	kind: 'text',
	content
})

const createPluralPart = ({ k, z, o, t, f, m, r }: BasePluralPart): PluralPart => ({
	kind: 'plural',
	key: k,
	...(z ? { zero: z } : undefined),
	one: o || '',
	...(t ? { two: t } : undefined),
	...(f ? { few: f } : undefined),
	...(m ? { many: m } : undefined),
	other: r,
})

// TODO: add formatter and switch-case support
const createParameterPart = ({ k, i, n }: ArgumentPart): ParameterPart => ({
	kind: 'parameter',
	key: k,
	type: i || 'unknown',
	optional: n || false
})
