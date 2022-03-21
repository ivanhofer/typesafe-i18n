import { parseRawText } from '../../parser/src/index'
import type { Part } from '../../parser/src/types'
import type { Arguments, BaseFormatters, Cache, Locale, LocalizedString } from './core'
import { translate } from './core'

export type TranslateByString = (text: string, ...args: Arguments) => LocalizedString

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
): (<Translation extends string>(text: Translation, ...args: Args<Translation, keyof F>) => LocalizedString) =>
	translateString.bind(null, {}, new Intl.PluralRules(locale), formatters)

export const i18nStringUntyped = <L extends Locale, F extends BaseFormatters>(
	locale: L,
	formatters: F = {} as F,
): TranslateByString => translateString.bind(null, {}, new Intl.PluralRules(locale), formatters)

// --------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------

type GetArg<Arg extends string, Type> = Arg extends `${infer OptionalArg}?`
	? Partial<Record<OptionalArg, Type>>
	: Record<Arg, Type>

type GetCaseType<Case extends string> = Case extends '*' ? string : Case

type ExtractCase<CaseDefinition extends string> = CaseDefinition extends `${infer Case}:${string}`
	? GetCaseType<Trim<Case>>
	: string

type ExtractCases<SwitchCaseDefinition extends string> = SwitchCaseDefinition extends `${infer Case},${infer Rest}`
	? [ExtractCase<Case>, ...ExtractCases<Rest>]
	: [ExtractCase<SwitchCaseDefinition>]

type SwitchCase<Arg extends string, SwitchCaseDefinition extends string> = GetArg<
	Arg,
	ExtractCases<SwitchCaseDefinition>[number]
>

type MergePipes<A, B> = A extends string ? A : B extends string ? B : A | B

type PipeArgumentHelper<Piped extends string, Formatters extends PropertyKey, Type> = Piped extends Formatters
	? Type
	: Piped extends ''
	? Type
	: `unknown Formatter '${Piped}'`

type PipeArgument<
	Arg extends string,
	Formatters extends PropertyKey,
	Piped extends string,
	Type,
> = Piped extends `${infer Pipe1}|${infer Rest}`
	? MergePipes<PipeArgument<Arg, Formatters, Trim<Pipe1>, Type>, PipeArgument<Arg, Formatters, Trim<Rest>, Type>>
	: Piped extends `{${string}`
	? Piped extends `${string}}`
		? Piped extends `{${infer SwitchCaseDefinition}}`
			? SwitchCase<Arg, Trim<SwitchCaseDefinition>>
			: PipeArgumentHelper<Piped, Formatters, Type>
		: PipeArgument<Arg, Formatters, `${Piped}}`, Type>
	: PipeArgumentHelper<Piped, Formatters, Type>

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

type DefineArg<
	Arg extends string,
	Formatters extends PropertyKey,
> = Arg extends `${infer Arg}:${infer Type}|${infer Piped}`
	? PipeArgument<Arg, Formatters, Trim<Piped>, GetArg<Trim<Arg>, DetectType<Trim<Type>>>>
	: Arg extends `${infer Arg}|${infer Piped}`
	? PipeArgument<Arg, Formatters, Trim<Piped>, GetArg<Trim<Arg>, unknown>>
	: Arg extends `${infer Arg}:${infer Type}`
	? GetArg<Trim<Arg>, DetectType<Trim<Type>>>
	: GetArg<Trim<Arg>, unknown>

type DetectArg<Part extends string, Formatters extends PropertyKey> = Part extends `{${string}}`
	? []
	: [DefineArg<Part, Formatters>]

type Merge<A extends Array<unknown>, B extends Array<unknown>> = A[number] & B[number]

type DetectArgs<
	Translation extends string,
	Formatters extends PropertyKey,
> = Translation extends `${infer Before}{{${string}}}${infer Rest}`
	? [Merge<DetectArgs<Before, Formatters>, DetectArgs<Rest, Formatters>>]
	: Translation extends `${string}{${infer Arg}}}${infer Rest}`
	? [Merge<DetectArg<`${Arg}}`, Formatters>, DetectArgs<Rest, Formatters>>]
	: Translation extends `${string}{${infer Arg}}${infer Rest}`
	? [Merge<DetectArg<Arg, Formatters>, DetectArgs<Rest, Formatters>>]
	: unknown[]

type Args<
	Translation extends string,
	Formatters extends PropertyKey,
> = Translation extends `${string}{${string}}${string}` ? DetectArgs<Translation, Formatters> : never
