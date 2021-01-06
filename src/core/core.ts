import { isPrimitiveObject, isString } from 'typesafe-utils'
import type { FormatterFn } from '../formatters/_types'
import type { InjectorPart, Part, PluralPart } from './parser'
import { parseRawText } from './parser'

// --------------------------------------------------------------------------------------------------------------------
// types --------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------

type TranslationParts<T> = {
	[key in keyof T]: Part[]
}

type Cache<T> = TranslationParts<T>

type LangaugeTranslationKey<T> = keyof T

type LangaugeBaseTranslationArgs = {
	[key in string]: unknown
}

export type TranslatorFn<T> = {
	[key in keyof T]: (...args: unknown[]) => string
}

export type LangaugeBaseTranslation = {
	[key: string]: string
}

export type Formatters = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[formatter: string]: FormatterFn<any>
}

// --------------------------------------------------------------------------------------------------------------------
// implementation -----------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------

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

const applyValues = (
	textParts: Part[],
	pluralRules: Intl.PluralRules,
	formatters: Formatters,
	args: LangaugeBaseTranslationArgs,
) => {
	return textParts
		.map((part) => {
			if (isString(part)) {
				return part
			}

			const { k: key = '0', f: formatterKeys = [] } = part as InjectorPart
			const { r: other } = part as PluralPart
			if (other) {
				return getPlural(pluralRules, part as PluralPart, <number>args[key]) || ''
			}

			const value = args[key]

			const formattedValue = formatterKeys.length ? applyFormatters(formatters, formatterKeys, value) : value

			return ('' + (formattedValue ?? '')).trim()
		})
		.join('')
}

const getTextParts = <T extends LangaugeBaseTranslation>(
	cache: Cache<T>,
	translationObject: T,
	key: LangaugeTranslationKey<T>,
): Part[] => {
	const cached = cache[key]
	if (cached) return cached

	const rawText = getTextFromTranslationKey(translationObject, key)
	const textInfo = parseRawText(rawText)

	cache[key] = textInfo
	return textInfo
}

const wrapTranslateFunction = <L extends string, T extends LangaugeBaseTranslation, F extends Formatters>(
	locale: L,
	translationObject: T,
	formatters: F,
) => {
	const cache: Cache<T> = {} as TranslationParts<T>
	const pluralRules = new Intl.PluralRules(locale)
	return (key: LangaugeTranslationKey<T>, ...args: unknown[]) => {
		const textInfo = getTextParts(cache, translationObject, key)

		const transformedArgs = ((args.length === 1 && isPrimitiveObject(args[0])
			? args[0]
			: args) as unknown) as LangaugeBaseTranslationArgs

		return applyValues(textInfo, pluralRules, formatters, transformedArgs)
	}
}

export function langauge<
	L extends string,
	T extends LangaugeBaseTranslation,
	// eslint-disable-next-line @typescript-eslint/ban-types
	A extends object = TranslatorFn<T>,
	F extends Formatters = Formatters
>(locale: L, translationObject: T, formatters: F): A

export function langauge<
	L extends string,
	T extends LangaugeBaseTranslation,
	// eslint-disable-next-line @typescript-eslint/ban-types
	A extends object = TranslatorFn<T>
>(locale: L, translationObject: T): A

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
export function langauge(locale: any, translationObject: any, formatters: any = {}): any {
	const translateFunction = wrapTranslateFunction(locale, translationObject, formatters)

	return new Proxy(
		{},
		{
			get: (_target, name: string) => translateFunction.bind(null, name),
		},
	)
}
