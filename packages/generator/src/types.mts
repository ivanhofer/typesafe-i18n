import type { TransformParameterPart } from 'typesafe-i18n/packages/parser/src/advanced.mjs'
import { isArray, isObject, TypeGuard } from 'typesafe-utils'

export type Arg = {
	key: string
	transforms: TransformParameterPart[]
	pluralOnly?: boolean | undefined
	optional?: boolean | undefined
}

export type TypeInformation = {
	types: string[]
	optional?: boolean | undefined
}

export type Types = {
	[key: string]: TypeInformation
}

export type JsDocInfos = {
	[key: string]: JsDocInfo
}

export type JsDocInfo = {
	text: string
	types: Types
	pluralOnlyArgs: string[]
}

export type ParsedResultEntry = {
	key: string
	text: string
	textWithoutTypes: string
	args?: Arg[]
	types: Types
	parentKeys: string[]
}

export type ParsedResult =
	| ParsedResultEntry
	| {
			[key: string]: ParsedResult[]
	  }

export const isParsedResultEntry = <T extends ParsedResult>(entry: T): entry is TypeGuard<ParsedResultEntry, T> =>
	isArray(entry.parentKeys) && isObject(entry.types)
