import { isBoolean, isPrimitiveObject, isString } from 'typesafe-utils'
import type { FormatterFn } from '../formatters/_types'
import type { InjectorPart, Part, PluralPart } from './parser'
import { parseRawText } from './parser'

// --------------------------------------------------------------------------------------------------------------------
// types --------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------

type TranslationParts<T> = {
	[key in keyof T]: Part[]
}

type Cache<T = LangaugeBaseTranslation> = TranslationParts<T>

type LangaugeTranslationKey<T> = keyof T

type LangaugeBaseTranslationArgs = {
	[key in string]: unknown
}

type LangaugeBaseTranslationFunction = (...args: unknown[]) => string

export type TranslatorFn<T> = {
	[key in keyof T]: LangaugeBaseTranslationFunction
}

export type LangaugeBaseTranslation = {
	[key: string]: string
}

export type Formatters = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[formatter: string]: FormatterFn<any>
}

type TranslateByString = ((text: string) => string) | ((text: string, ...args: unknown[]) => string)

type TranslateByKey<T> = (key: LangaugeTranslationKey<T>, ...args: unknown[]) => string

// --------------------------------------------------------------------------------------------------------------------
// implementation -----------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------

type IsPluralPart<T> = T extends PluralPart ? T : never

export const isPluralPart = (part: Part): part is IsPluralPart<Part> => !!((<PluralPart>part).o || (<PluralPart>part).r)

const getTextFromTranslationKey = <T extends LangaugeBaseTranslation>(
	translationObject: T,
	key: LangaugeTranslationKey<T>,
): string => translationObject[key] ?? (key as string)

const applyFormatters = (formatters: Formatters, formatterKeys: string[], value: unknown) =>
	formatterKeys.reduce((prev, formatterKey) => {
		const formatter = formatters[formatterKey]
		return formatter ? formatter(prev) : prev
	}, value)

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

			const { k: key = '0', f: formatterKeys = [] } = part as InjectorPart
			const value = args[key] as number | boolean

			if (isPluralPart(part)) {
				return isBoolean(value) ? (value ? part.o : part.r) : getPlural(pluralRules, part, value) || ''
			}

			const formattedValue = formatterKeys.length ? applyFormatters(formatters, formatterKeys, value) : value

			return ('' + (formattedValue ?? '')).trim()
		})
		.join('')

const translate = (textParts: Part[], pluralRules: Intl.PluralRules, formatters: Formatters, args: unknown[]) => {
	const transformedArgs = ((args.length === 1 && isPrimitiveObject(args[0])
		? args[0]
		: args) as unknown) as LangaugeBaseTranslationArgs

	return applyArguments(textParts, pluralRules, formatters, transformedArgs)
}

// string -------------------------------------------------------------------------------------------------------------

const getPartsFromString = (cache: Cache, text: string): Part[] => {
	let cached = cache[text]
	if (!cached) {
		cached = cache[text] = parseRawText(text)
	}

	return cached
}

const translateString = <F extends Formatters>(
	cache: Cache,
	pluralRules: Intl.PluralRules,
	formatters: F,
	text: string,
	...args: unknown[]
) => translate(getPartsFromString(cache, text), pluralRules, formatters, args)

export const langaugeStringWrapper = <L extends string, F extends Formatters = Formatters>(
	locale: L,
	formatters: F = {} as F,
): TranslateByString => translateString.bind(null, {}, new Intl.PluralRules(locale), formatters)

// object -------------------------------------------------------------------------------------------------------------

const getTextPartsByKey = <T extends LangaugeBaseTranslation>(
	cache: Cache<T>,
	translationObject: T,
	key: LangaugeTranslationKey<T>,
): Part[] => getPartsFromString(cache, getTextFromTranslationKey(translationObject, key))

const getTranslateInstance = <L extends string, T extends LangaugeBaseTranslation, F extends Formatters>(
	locale: L,
	translationObject: T,
	formatters: F,
): TranslateByKey<T> => {
	const cache: Cache<T> = {} as TranslationParts<T>
	const pluralRules = new Intl.PluralRules(locale)
	return (key: LangaugeTranslationKey<T>, ...args: unknown[]) =>
		translate(getTextPartsByKey(cache, translationObject, key), pluralRules, formatters, args)
}

export function langaugeObjectWrapper<
	L extends string,
	T extends LangaugeBaseTranslation,
	// eslint-disable-next-line @typescript-eslint/ban-types
	A extends object = TranslatorFn<T>,
	F extends Formatters = Formatters
>(locale: L, translationObject: T, formatters: F): A

export function langaugeObjectWrapper<
	L extends string,
	T extends LangaugeBaseTranslation,
	// eslint-disable-next-line @typescript-eslint/ban-types
	A extends object = TranslatorFn<T>
>(locale: L, translationObject: T): A

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
export function langaugeObjectWrapper(locale: any, translationObject: any, formatters: any = {}): any {
	const translateFunctionInstance = getTranslateInstance(locale, translationObject, formatters)

	return new Proxy(
		{},
		{
			get: (_target, key: string) => translateFunctionInstance.bind(null, key),
		},
	)
}
