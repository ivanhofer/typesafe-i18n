import type { TypeGuard } from 'typesafe-utils'
import type { ArgumentPart, Part, PluralPart } from './parser'

// --------------------------------------------------------------------------------------------------------------------
// types --------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------

type TranslationParts<T extends BaseTranslation | BaseTranslation[] = BaseTranslation> = {
	[key in keyof T]: Part[]
}

export type Cache<T extends BaseTranslation | BaseTranslation[] = BaseTranslation> = TranslationParts<T>

export type TranslationKey<T extends BaseTranslation | BaseTranslation[] = BaseTranslation> = keyof T

declare const localized: unique symbol
export type LocalizedString = string & { readonly [localized]: unknown }

type BaseTranslationFunction = (...args: Arguments) => LocalizedString

export type TranslationFunctions<
	T extends
		| BaseTranslation
		| BaseTranslation[]
		| Readonly<BaseTranslation>
		| Readonly<BaseTranslation[]> = BaseTranslation,
> = {
	//@ts-ignore
	[key in keyof T]: T[key] extends string ? BaseTranslationFunction : TranslationFunctions<T[key]>
}

export type Locale = string

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Arguments = any[]

export type BaseTranslation =
	| {
			[key: number]:
				| string
				| BaseTranslation
				| BaseTranslation[]
				| Readonly<string>
				| Readonly<BaseTranslation>
				| Readonly<BaseTranslation[]>
	  }
	| {
			[key: number | string]:
				| string
				| BaseTranslation
				| BaseTranslation[]
				| Readonly<string>
				| Readonly<BaseTranslation>
				| Readonly<BaseTranslation[]>
	  }
	| string[]
	| Readonly<string[]>

export interface LocaleMapping {
	locale: string
	translations: BaseTranslation | BaseTranslation[]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FormatterFunction<T = any, U = unknown> = (value: T) => U

export type BaseFormatters = {
	[formatter: string]: FormatterFunction
}

// --------------------------------------------------------------------------------------------------------------------
// implementation -----------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------

export const isPluralPart = (part: Part): part is TypeGuard<PluralPart, Part> =>
	!!((<PluralPart>part).o || (<PluralPart>part).r)

const applyFormatters = (formatters: BaseFormatters, formatterKeys: string[], value: unknown) =>
	formatterKeys.reduce((prev, formatterKey) => formatters[formatterKey]?.(prev) ?? prev, value)

const getPlural = (pluralRules: Intl.PluralRules, { z, o, t, f, m, r }: PluralPart, value: unknown) => {
	switch (z && value == 0 ? 'zero' : pluralRules.select(value as number)) {
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

const REGEX_PLURAL = /\?\?/g

const applyArguments = (
	textParts: Part[],
	pluralRules: Intl.PluralRules,
	formatters: BaseFormatters,
	args: Arguments,
): LocalizedString =>
	textParts
		.map((part) => {
			if (typeof part === 'string') {
				return part
			}

			const { k: key = '0', f: formatterKeys = [] } = part as ArgumentPart
			const value = args[key as unknown as number] as unknown

			if (isPluralPart(part)) {
				return (
					(typeof value === 'boolean' ? (value ? part.o : part.r) : getPlural(pluralRules, part, value)) || ''
				).replace(REGEX_PLURAL, value as string)
			}

			const formattedValue = formatterKeys.length ? applyFormatters(formatters, formatterKeys, value) : value

			return ('' + (formattedValue ?? '')).trim()
		})
		.join('') as LocalizedString

export const translate = (
	textParts: Part[],
	pluralRules: Intl.PluralRules,
	formatters: BaseFormatters,
	args: Arguments,
): LocalizedString => {
	const firstArg = args[0]
	const isObject = firstArg && typeof firstArg === 'object' && firstArg.constructor === Object
	const transformedArgs = (args.length === 1 && isObject ? firstArg : args) as Arguments

	return applyArguments(textParts, pluralRules, formatters, transformedArgs)
}
