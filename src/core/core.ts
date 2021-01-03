import { isPrimitiveObject, isString } from 'typesafe-utils'
import type { FormatterFn } from '../formatters/_types'
import type { InjectorPart, Part, SingularPluralPart } from './parser'
import { parseRawText } from './parser'

// --------------------------------------------------------------------------------------------------------------------
// types --------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------

type TranslationParts<T> = {
	[key in keyof T]: Part[]
}

type Cache<T> = TranslationParts<T> | null

type LangaugeTranslationKey<T> = keyof T

type LangaugeBaseTranslationArgs = {
	[key in string]: unknown
}

type ConfigWithoutFormatters = {
	useCache?: boolean
	formatters?: never
}

export type ConfigWithFormatters<T extends Formatters = Formatters> = {
	useCache?: boolean
	formatters: T
}

export type Config<T extends Formatters = Formatters> = ConfigWithoutFormatters | ConfigWithFormatters<T>

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

const applyValues = (textParts: Part[], formatters: Formatters, args: LangaugeBaseTranslationArgs) => {
	return textParts
		.map((part) => {
			if (isString(part)) {
				return part
			}

			const { k: key = '0', f: formatterKeys = [] } = part as InjectorPart
			const { s: singular = '', p: plural } = part as SingularPluralPart
			if (plural) {
				return args[key] == '1' ? singular : plural
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
	const cached = cache && cache[key]
	if (cached) return cached

	const rawText = getTextFromTranslationKey(translationObject, key)
	const textInfo = parseRawText(rawText)

	cache && (cache[key] = textInfo)
	return textInfo
}

const wrapTranslateFunction = <T extends LangaugeBaseTranslation>(
	translationObject: T,
	{ formatters = {}, useCache = true }: Config = {},
) => {
	const cache: Cache<T> = (useCache && ({} as TranslationParts<T>)) || null
	return (key: LangaugeTranslationKey<T>, ...args: unknown[]) => {
		const textInfo = getTextParts(cache, translationObject, key)

		const transformedArgs = ((args.length === 1 && isPrimitiveObject(args[0])
			? args[0]
			: args) as unknown) as LangaugeBaseTranslationArgs

		return applyValues(textInfo, formatters, transformedArgs)
	}
}

export function langauge<
	T extends LangaugeBaseTranslation,
	// eslint-disable-next-line @typescript-eslint/ban-types
	A extends object = TranslatorFn<T>,
	F extends Formatters = Formatters
>(translationObject: T, config: ConfigWithFormatters<F>): A

export function langauge<
	T extends LangaugeBaseTranslation,
	// eslint-disable-next-line @typescript-eslint/ban-types
	A extends object = TranslatorFn<T>
>(translationObject: T, config?: Config): A

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
export function langauge(translationObject: any, config: any): any {
	const translateFunction = wrapTranslateFunction(translationObject, config)

	return new Proxy(
		{},
		{
			get: (_target, name: string) => translateFunction.bind(null, name),
		},
	)
}
