import { isBoolean, isPrimitiveObject, isString } from 'typesafe-utils'
import type { FormatterFn } from '../formatters/_types'
import type { ArgumentPart, Part, PluralPart } from './parser'

// --------------------------------------------------------------------------------------------------------------------
// types --------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------

type TranslationParts<T> = {
	[key in keyof T]: Part[]
}

export type Cache<T = LangaugeBaseTranslation> = TranslationParts<T>

export type LangaugeTranslationKey<T> = keyof T

type LangaugeBaseTranslationFunction = (...args: unknown[]) => string

export type TranslatorFn<T> = {
	[key in keyof T]: LangaugeBaseTranslationFunction
}

export type LangaugeBaseTranslation = {
	[key: string]: string
}

type LangaugeBaseTranslationArgs = {
	[key in keyof LangaugeBaseTranslation]: unknown
}

export type Formatters = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[formatter: string]: FormatterFn<any>
}

// --------------------------------------------------------------------------------------------------------------------
// implementation -----------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------

type IsPluralPart<T> = T extends PluralPart ? T : never

export const isPluralPart = (part: Part): part is IsPluralPart<Part> => !!((<PluralPart>part).o || (<PluralPart>part).r)

const applyFormatters = (formatters: Formatters, formatterKeys: string[], value: unknown) =>
	formatterKeys.reduce((prev, formatterKey) => formatters[formatterKey]?.(prev) || prev, value)

const getPlural = (pluraRules: Intl.PluralRules, { z, o, t, f, m, r }: PluralPart, value: number) => {
	switch (pluraRules.select(value)) {
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
	formatters: Formatters,
	args: LangaugeBaseTranslationArgs,
) =>
	textParts
		.map((part) => {
			if (isString(part)) {
				return part
			}

			const { k: key = '0', f: formatterKeys = [] } = part as ArgumentPart
			const value = args[key] as number | boolean

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
	formatters: Formatters,
	args: unknown[],
): string => {
	const transformedArgs = ((args.length === 1 && isPrimitiveObject(args[0])
		? args[0]
		: args) as unknown) as LangaugeBaseTranslationArgs

	return applyArguments(textParts, pluralRules, formatters, transformedArgs)
}
