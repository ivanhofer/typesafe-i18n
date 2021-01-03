// internal -----------------------------------------------------------------------------------------------------------

import { Part } from '../core/parser'
import { FormatterFn } from '../formatters/_types'

export type Cache<T> = TranslationParts<T> | null

export type LangaugeTranslationKey<T> = keyof T

export type LangaugeBaseTranslation = {
	[key: string]: string
}

export type LangaugeBaseTranslationArgs = {
	[key in string]: unknown
}

export type TranslatorFn<T> = {
	[key in keyof T]: (...args: unknown[]) => string
}

export type TranslationParts<T> = {
	[key in keyof T]: Part[]
}

// config -------------------------------------------------------------------------------------------------------------

export type ConfigWithoutFormatters = {
	useCache?: boolean
	formatters?: never
}

export type ConfigWithFormatters<T extends Formatters = Formatters> = {
	useCache?: boolean
	formatters: T
}

export type Config<T extends Formatters = Formatters> = ConfigWithoutFormatters | ConfigWithFormatters<T>

// formatters ---------------------------------------------------------------------------------------------------------

export type Formatters = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[formatter: string]: FormatterFn<any>
}
