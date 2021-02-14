import { isBoolean, isPrimitiveObject, isString } from 'typesafe-utils'
import type { FormatterFunction } from '../formatters/_types'
import type { ArgumentPart, Part, PluralPart } from './parser'

// --------------------------------------------------------------------------------------------------------------------
// types --------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------

type TranslationParts<T = BaseTranslation> = {
	[key in keyof T]: Part[]
}

export type Cache<T = BaseTranslation> = TranslationParts<T>

export type TranslationKey<T> = keyof T

type BaseTranslationFunction = (...args: Arguments) => string

export type TranslationFunctions<T = BaseTranslation> = {
	[key in keyof T]: BaseTranslationFunction
}

export type Locale = string

export type Arguments = unknown[]

export type BaseTranslation = {
	[key: string]: string
}

export type BaseFormatters = {
	[formatter: string]: FormatterFunction
}

// --------------------------------------------------------------------------------------------------------------------
// implementation -----------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------

type IsPluralPart<T> = T extends PluralPart ? T : never

export const isPluralPart = (part: Part): part is IsPluralPart<Part> => !!((<PluralPart>part).o || (<PluralPart>part).r)

const applyFormatters = (formatters: BaseFormatters, formatterKeys: string[], value: unknown) =>
	formatterKeys.reduce((prev, formatterKey) => formatters[formatterKey]?.(prev) || prev, value)

const getPlural = (pluraRules: Intl.PluralRules, { z, o, t, f, m, r }: PluralPart, value: unknown) => {
	switch (pluraRules.select(value as number)) {
		case 'zero':
			return z
		case 'one':
			return o
		case 'two':
			return t
		case 'few':
			return f
		case 'many':
			return m
		default:
			return r
	}
}

const applyArguments = (
	textParts: Part[],
	pluralRules: Intl.PluralRules,
	formatters: BaseFormatters,
	args: Arguments,
) =>
	textParts
		.map((part) => {
			if (isString(part)) {
				return part
			}

			const { k: key = '0', f: formatterKeys = [] } = part as ArgumentPart
			const value = args[(key as unknown) as number] as unknown

			if (isPluralPart(part)) {
				return isBoolean(value) ? (value ? part.o : part.r) : getPlural(pluralRules, part, value) || ''
			}

			const formattedValue = formatterKeys.length ? applyFormatters(formatters, formatterKeys, value) : value

			return ('' + (formattedValue ?? '')).trim()
		})
		.join('')

export const translate = (
	textParts: Part[],
	pluralRules: Intl.PluralRules,
	formatters: BaseFormatters,
	args: Arguments,
): string => {
	const transformedArgs = (args.length === 1 && isPrimitiveObject(args[0]) ? args[0] : args) as Arguments

	return applyArguments(textParts, pluralRules, formatters, transformedArgs)
}
