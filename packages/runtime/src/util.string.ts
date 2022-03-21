import { parseRawText } from '../../parser/src/index'
import type { Part } from '../../parser/src/types'
import type { Arguments, BaseFormatters, Cache, Locale, LocalizedString } from './core'
import { translate } from './core'

export type TranslateByString =
	| ((text: string) => LocalizedString)
	| ((text: string, ...args: Arguments) => LocalizedString)

export const getPartsFromString = (cache: Cache, text: string): Part[] =>
	(cache as Record<string, Part[]>)[text] || ((cache as Record<string, Part[]>)[text] = parseRawText(text))

const translateString = <F extends BaseFormatters>(
	cache: Cache,
	pluralRules: Intl.PluralRules,
	formatters: F,
	text: string,
	...args: Arguments
) => translate(getPartsFromString(cache, text), pluralRules, formatters, args)

export const i18nString = <L extends Locale, F extends BaseFormatters>(
	locale: L,
	formatters: F = {} as F,
): TranslateByString => translateString.bind(null, {}, new Intl.PluralRules(locale), formatters)

// --------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------

type DetectType<Type extends string> = Type extends 'string'
	? string
	: Type extends 'number'
	? number
	: Type extends 'number[]'
	? number[]
	: Type extends 'Array<number>'
	? Array<number>
	: Type extends 'boolean'
	? boolean
	: Type extends 'boolean[]'
	? boolean[]
	: Type extends 'Array<boolean>'
	? Array<boolean>
	: Type extends 'Date'
	? Date
	: Type extends 'Date[]'
	? Date[]
	: Type extends 'Array<Date>'
	? Array<Date>
	: Type extends 'bigint'
	? bigint
	: Type extends 'bigint[]'
	? bigint[]
	: Type extends 'Array<bigint>'
	? Array<bigint>
	: Type extends 'object'
	? object
	: Type extends 'object[]'
	? object[]
	: Type extends 'Array<object>'
	? Array<object>
	: Type extends 'undefined'
	? undefined
	: Type extends 'undefined[]'
	? undefined[]
	: Type extends 'Array<undefined>'
	? Array<undefined>
	: Type extends 'null'
	? null
	: Type extends 'null[]'
	? null[]
	: Type extends 'Array<null>'
	? Array<null>
	: Type extends 'LocalizedString'
	? LocalizedString
	: Type extends 'LocalizedString[]'
	? LocalizedString[]
	: Type extends 'Array<LocalizedString>'
	? Array<LocalizedString>
	: unknown

type Empty = ' ' | '\n' | '\t'
type TrimL<S extends string> = S extends `${Empty}${infer L}` ? TrimL<L> : S
type TrimR<S extends string> = S extends `${infer L}${Empty}` ? TrimR<L> : S
type Trim<S extends string> = TrimR<TrimL<S>>

type DefineArg<Arg extends string> = Arg extends `${infer Arg}:${infer Type}|${infer TODO_Formatter}`
	? Record<Trim<Arg>, DetectType<Trim<Type>>>
	: Arg extends `${infer Arg}:${infer Type}`
	? Record<Trim<Arg>, DetectType<Trim<Type>>>
	: Record<Trim<Arg>, unknown>

type DetectArg<Part extends string> = Part extends `{${string}}` ? [] : [DefineArg<Part>]

type Merge<A extends Array<unknown>, B extends Array<unknown>> = A[number] & B[number]

type DetectArgs<Translation extends string> = Translation extends `${string}{{${string}}}${infer Rest}`
	? DetectArgs<Rest>
	: Translation extends `${string}{${infer Arg}}${infer Rest}`
	? [Merge<DetectArg<Arg>, DetectArgs<Rest>>]
	: unknown[]

type Args<Translation extends string> = Translation extends `${string}{${string}}${string}`
	? DetectArgs<Translation>
	: never

const i18n = <Translation extends string>(text: Translation, ...args: Args<Translation>) => {
	return ''
}

// --------------------------------------------------------------------------------------------------------------------

// - text-only
i18n('test')
// @ts-expect-error
i18n('', '')

// - plural rules
i18n('{a} apple{{s}}', { a: 'test' })

// - single argument
i18n('{a}', { a: 123 })
i18n('{a}', { a: '' })
// @ts-expect-error
i18n('{a}')
// @ts-expect-error
i18n('{ a }', { ' a ': '' })
// @ts-expect-error
i18n('{a}', { a: '', b: '' })
i18n('{b}', { b: 123 })

// - multiple arguments
i18n('{a}{b}', { a: '', b: 123 })
// @ts-expect-error
i18n('{a} {b}', { a: '' })
// @ts-expect-error
i18n(' {a} {b}', { a: '', c: 123 })
i18n('{a}{b}{c}{d}{e}{f}{g}{h}', { a: '', b: '', c: '', d: '', e: '', f: '', g: '', h: '' })

// - typed arguments
i18n('{a:string}', { a: '123' })
// @ts-expect-error
i18n('{a:string}', { a: 123 })
i18n('{a:number}', { a: 123 })
// @ts-expect-error
i18n('{a:number}', { a: '123' })
// @ts-expect-error
i18n('{a:number[]}', { a: [123, ''] })
i18n('{a:number[]}', { a: [123, 0] })
i18n('{a:Array<number>}', { a: [123, 0] })
// @ts-expect-error
i18n('{a:Array<number>}', { a: [''] })
i18n('{a:LocalizedString}', { a: '' as LocalizedString })

i18n('{a:string }', { a: '' })
i18n('{a: string}', { a: '' })
i18n('{a: string }', { a: '' })
