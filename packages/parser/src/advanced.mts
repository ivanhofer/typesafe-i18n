import { isNotUndefined, isString } from 'typesafe-utils'
import {
	BasicArgumentPart,
	BasicPart,
	BasicPluralPart,
	isBasicPluralPart,
	parseCases,
	parseRawText,
	REGEX_SWITCH_CASE
} from './basic.mjs'

// --------------------------------------------------------------------------------------------------------------------
// types --------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------

export type ParsedMessage = ParsedMessagePart[]

export type ParsedMessagePart = TextPart | PluralPart | ParameterPart

export type TextPart = {
	kind: 'text'
	content: string
}

export type PluralPart = {
	kind: 'plural'
	key: string
	zero?: string
	one: string
	two?: string
	few?: string
	many?: string
	other: string
}

export type ParameterPart = {
	kind: 'parameter'
	key: string
	types: string[]
	optional: boolean
	transforms: TransformParameterPart[]
	pluralOnly?: boolean
}

export type TransformParameterPart = TransformParameterFormatterPart | TransformParameterSwitchCasePart

export type TransformParameterFormatterPart = {
	kind: 'formatter'
	name: string
}

export type TransformParameterSwitchCasePart = {
	kind: 'switch-case'
	cases: TransformParameterSwitchCaseCasePart[]
}

export type TransformParameterSwitchCaseCasePart = {
	key: string
	value: string
}

// --------------------------------------------------------------------------------------------------------------------
// implementation -----------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------

export const isTextPart = (part: ParsedMessagePart): part is TextPart => part.kind === 'plural'

export const isPluralPart = (part: ParsedMessagePart): part is PluralPart => part.kind === 'plural'

export const isParameterPart = (part: ParsedMessagePart): part is ParameterPart => part.kind === 'parameter'

export const isTransformParameterFormatterPart = (
	part: TransformParameterPart,
): part is TransformParameterFormatterPart => part.kind === 'formatter'

// --------------------------------------------------------------------------------------------------------------------

// TODO: use `parseTranslationEntry` to improve types
export const parseMessage = (message: string): ParsedMessage =>
	parseRawText(message, false).map(createPart).filter(isNotUndefined)

const createPart = (part: BasicPart): ParsedMessagePart | undefined => {
	if (isString(part)) {
		return part ? createTextPart(part) : undefined
	}

	if (isBasicPluralPart(part)) return createPluralPart(part)

	return createParameterPart(part)
}

const createTextPart = (content: string): TextPart => ({
	kind: 'text',
	content,
})

const createPluralPart = ({ k, z, o, t, f, m, r }: BasicPluralPart): PluralPart => ({
	kind: 'plural',
	key: k,
	...(z ? { zero: z } : undefined),
	one: o || '',
	...(t ? { two: t } : undefined),
	...(f ? { few: f } : undefined),
	...(m ? { many: m } : undefined),
	other: r,
})

const createParameterPart = ({ k, i, n, f }: BasicArgumentPart): ParameterPart => ({
	kind: 'parameter',
	key: k,
	types: [i || 'unknown'],
	optional: n || false,
	transforms: (f || []).map(createTransformParameterPart),
})

const createTransformParameterPart = (transform: string): TransformParameterPart => {
	const isSwitchCase = transform.match(REGEX_SWITCH_CASE)

	return isSwitchCase
		? ({
				kind: 'switch-case',
				cases: Object.entries(parseCases(transform)).map(([key, value]) => ({ key, value })),
		  } as TransformParameterSwitchCasePart)
		: ({
				kind: 'formatter',
				name: transform,
		  } as TransformParameterFormatterPart)
}
