import { isNotUndefined, isString, pick, uniqueArray } from 'typesafe-utils'
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
	one?: string
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
	raw: string
}

export type TransformParameterSwitchCaseCasePart = {
	key: string
	value: string
}

// --------------------------------------------------------------------------------------------------------------------
// implementation -----------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------

export const isTextPart = (part: ParsedMessagePart): part is TextPart => part.kind === 'text'

export const isPluralPart = (part: ParsedMessagePart): part is PluralPart => part.kind === 'plural'

export const isParameterPart = (part: ParsedMessagePart): part is ParameterPart => part.kind === 'parameter'

export const isTransformParameterFormatterPart = (
	part: TransformParameterPart,
): part is TransformParameterFormatterPart => part.kind === 'formatter'

export const isTransformParameterSwitchCasePart = (
	part: TransformParameterPart,
): part is TransformParameterSwitchCasePart => part.kind === 'switch-case'

// --------------------------------------------------------------------------------------------------------------------

// TODO: use `parseTranslationEntry` to improve types
export const parseMessage = (message: string): ParsedMessage =>
	enhanceTypeInformation(parseRawText(message, false).map(createPart).filter(isNotUndefined))

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
	...(o ? { one: o } : undefined),
	...(t ? { two: t } : undefined),
	...(f ? { few: f } : undefined),
	...(m ? { many: m } : undefined),
	other: r,
})

export const createParameterPart = ({ k, i, n, f }: BasicArgumentPart): ParameterPart => ({
	kind: 'parameter',
	key: k,
	types: i ? [i] : [],
	optional: n || false,
	transforms: (f || []).map(createTransformParameterPart),
})

const createTransformParameterPart = (transform: string): TransformParameterPart => {
	const isSwitchCase = transform.match(REGEX_SWITCH_CASE)

	return isSwitchCase
		? ({
				kind: 'switch-case',
				cases: Object.entries(parseCases(transform)).map(([key, value]) => ({ key, value })),
				raw: transform,
		  } as TransformParameterSwitchCasePart)
		: ({
				kind: 'formatter',
				name: transform,
		  } as TransformParameterFormatterPart)
}

// --------------------------------------------------------------------------------------------------------------------

const enhanceTypeInformation = (parts: ParsedMessage): ParsedMessage => {
	const parameterParts = parts.filter(isParameterPart)
	const pluralParts = parts.filter(isPluralPart)

	const typeMap: Record<string, { types: string[]; optional: boolean }> = {}

	parameterParts.forEach(({ key, types, transforms, optional }) => {
		const enhancedTypes = types.length
			? types
			: parseTypesFromSwitchCaseStatement(transforms as [TransformParameterPart])
		typeMap[key] = {
			types: uniqueArray([...(typeMap[key]?.types || []), ...enhancedTypes]).filter(isNotUndefined),
			optional: typeMap[key]?.optional || optional,
		}
	})

	pluralParts.forEach(({ key }) => {
		if (!typeMap[key]?.types.length) {
			// if key has no types => add types that are valid for a PluralPart
			typeMap[key] = { types: ['string', 'number', 'boolean'], optional: false }
		}
	})

	// add 'unknown' if argument has no type
	Object.keys(typeMap).forEach((key) => {
		if (!typeMap[key]?.types.length) {
			typeMap[key] = { types: ['unknown'], optional: typeMap[key]?.optional || false }
		}
	})

	Object.entries(typeMap).forEach(([key, value]) => {
		const part = parameterParts.find((p) => p.key === key)
		if (!part) return

		part.types = value.types
		part.optional = part.optional || value.optional
	})

	return parts
}

export const REGEX_BRACKETS = /(^{)|(}$)/g

const parseTypesFromSwitchCaseStatement = (formatters: [TransformParameterPart] | [] | undefined) => {
	if (!formatters?.length) return []

	const formatter = formatters[0]
	if (!isTransformParameterSwitchCasePart(formatter)) return []

	const keys = formatter.cases.map(pick('key'))

	return keys.map((key) => (key === '*' ? 'string' : `'${key}'`))
}
