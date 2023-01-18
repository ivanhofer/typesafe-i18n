import { isNotUndefined, isString } from 'typesafe-utils'
import type { BasicArgumentPart, BasicPart, BasicPluralPart } from './basic.mjs'
import { parseCases, parseRawText, REGEX_SWITCH_CASE } from './basic.mjs'

// --------------------------------------------------------------------------------------------------------------------
// types --------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------

export type ParsedMessage = ParsedMessagePart[]

type ParsedMessagePart = TextPart | PluralPart | ParameterPart

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
	transforms: TransformParameterPart[]
}

type TransformParameterPart = TransformParameterFormatterPart | TransformParameterSwitchCasePart

type TransformParameterFormatterPart = {
	kind: 'formatter'
	name: string
}

type TransformParameterSwitchCasePart = {
	kind: 'switch-case'
	cases: TransformParameterSwitchCaseCasePart[]
}

type TransformParameterSwitchCaseCasePart = {
	key: string
	value: string
}

// --------------------------------------------------------------------------------------------------------------------
// implementation -----------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------

// TODO: use `parseTranslationEntry` to improve types
export const parseMessage = (message: string): ParsedMessage =>
	parseRawText(message, false).map(createPart).filter(isNotUndefined)

const createPart = (part: BasicPart): ParsedMessagePart | undefined => {
	if (isString(part)) {
		return part ? createTextPart(part) : undefined
	}

	if (isPluralPart(part)) return createPluralPart(part)

	return createParameterPart(part)
}

const isPluralPart = (part: Exclude<BasicPart, string>): part is BasicPluralPart =>
	!!((part as BasicPluralPart).o || (part as BasicPluralPart).r)

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
	type: i || 'unknown',
	optional: n || false,
	transforms: (f || []).map(createTransformParameterPart),
})

const createTransformParameterPart = (transform: string): TransformParameterPart => {
	const isSwitchCase = transform.match(REGEX_SWITCH_CASE)

	return isSwitchCase
		? ({
				kind: 'switch-case',
				cases: Object.entries(parseCases(transform)).map(([key, value]) => ({ key, value })),
		  } satisfies TransformParameterSwitchCasePart)
		: ({
				kind: 'formatter',
				name: transform,
		  } satisfies TransformParameterFormatterPart)
}
