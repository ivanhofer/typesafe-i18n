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
