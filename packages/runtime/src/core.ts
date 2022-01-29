import type { TypeGuard } from 'typesafe-utils'
import { removeOuterBrackets } from '../../parser/src/index'
import type { ArgumentPart, Part, PluralPart } from '../../parser/src/types'

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
	[key in keyof T]: T[key] extends string
		? BaseTranslationFunction
		: // eslint-disable-next-line @typescript-eslint/no-explicit-any
		T[key] extends Record<any, any>
		? TranslationFunctions<T[key]>
		: never
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
			[key: string]:
				| string
				| BaseTranslation
				| BaseTranslation[]
				| Readonly<string>
				| Readonly<BaseTranslation>
				| Readonly<BaseTranslation[]>
	  }
	| string[]
	| Readonly<string[]>

export type LocaleTranslations<L extends Locale, T = unknown> = {
	[key in L]: T
}

export type FormattersInitializer<L extends Locale, F extends BaseFormatters> = (locale: L) => F

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FormatterFunction<T = any, U = unknown> = (value: T) => U

export type BaseFormatters = {
	[formatter: string]: FormatterFunction
}

export interface LocaleMapping {
	locale: string
	translations: BaseTranslation | BaseTranslation[]
}

// --------------------------------------------------------------------------------------------------------------------
// implementation -----------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------

export const isPluralPart = (part: Part): part is TypeGuard<PluralPart, Part> =>
	!!((<PluralPart>part).o || (<PluralPart>part).r)

const REGEX_SWITCH_CASE = /^\{.*\}$/

const applyFormatters = (formatters: BaseFormatters, formatterKeys: string[], initialValue: unknown) =>
	formatterKeys.reduce(
		(value, formatterKey) =>
			(formatterKey.match(REGEX_SWITCH_CASE)
				? (() => {
						const cases = Object.fromEntries(
							removeOuterBrackets(formatterKey)
								.split(',')
								.map((part) => part.split(':').map((value) => value.trim())),
						)

						return cases[value as string] ?? cases['*']
				  })()
				: formatters[formatterKey]?.(value)) ?? value,
		initialValue,
	)

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

const REGEX_PLURAL_VALUE_INJECTION = /\?\?/g

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
				).replace(REGEX_PLURAL_VALUE_INJECTION, value as string)
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
