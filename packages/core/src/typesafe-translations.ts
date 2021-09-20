type IsTypeInArrayOfTypes<Type extends string, Arr extends string[]> = Arr extends [infer Item, ...infer Rest]
	? Type extends Item
		? Type
		: IsTypeInArrayOfTypes<Type, Rest extends string[] ? Rest : []>
	: never

type RemoveTypeFromArrayOfTypes<ItemToRemove extends string, Arr extends string[]> = Arr extends [
	infer Item,
	...infer Rest
]
	? Item extends ItemToRemove
		? Rest
		: [Item, ...RemoveTypeFromArrayOfTypes<ItemToRemove, Rest extends string[] ? Rest : []>]
	: []

type ParseIndividualParts<
	Value extends string,
	Params extends string[],
> = Value extends `${infer Prefix}{${infer Param}}${infer Postfix}`
	? IsTypeInArrayOfTypes<Param, Params> extends never
		? undefined
		: ParseIndividualParts<
				Postfix,
				RemoveTypeFromArrayOfTypes<IsTypeInArrayOfTypes<Param, Params>, Params>
		  > extends string[]
		? [
				Prefix,
				`{${IsTypeInArrayOfTypes<Param, Params>}}`,
				...ParseIndividualParts<Postfix, RemoveTypeFromArrayOfTypes<IsTypeInArrayOfTypes<Param, Params>, Params>>
		  ]
		: undefined
	: [Value]

type ExtractParamsAsArray<Str extends string> = Str extends `${string}{${infer Param}}${infer Postfix}`
	? [Param, ...ExtractParamsAsArray<Postfix>]
	: []

type ContainsUndefined<Arr extends unknown | Array<unknown>> = Arr extends [infer Item, ...infer Rest]
	? Item extends undefined
		? undefined
		: ContainsUndefined<Rest> extends undefined
		? undefined
		: [Item, ...ContainsUndefined<Rest>]
	: Arr extends undefined
	? undefined
	: Arr

type IsTranslationValid<Value extends string, Params extends string[]> = ContainsUndefined<
	ParseIndividualParts<Value, Params>
> extends undefined
	? TypesafeI18nValidationError
	: Value

class TypesafeI18nValidationError extends Error {}

// TODO: enable nesting support

// --------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------

const T = <Key extends keyof Translation, Value extends Translation[Key]>(
	key: Key,
	value: Value,
): Record<Key, IsTranslationValid<Value, ExtractParamsAsArray<Translation[Key]>>> =>
	({
		[key]: value,
	} as Record<Key, IsTranslationValid<Value, ExtractParamsAsArray<Translation[Key]>>>)

const createTranslation = (translations: Record<keyof Translation, string>) =>
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	Object.fromEntries(translations as any) as Translation

// --------------------------------------------------------------------------------------------------------------------

export type Translation = {
	/**
	 * Hello {name}!
	 * @param {string} name
	 */
	HI: RequiredParams1<'name'>
	/**
	 * Hello {name} {name}!
	 * @param {string} name
	 */
	Test: RequiredParams2<'name', 'name'>
}

type Param<P extends string> = `{${P}}`

type Params1<P1 extends string> = `${string}${Param<P1>}${string}`

type Params2<P1 extends string, P2 extends string> = `${string}${Param<P1>}${string}${Param<P2>}${string}`

type RequiredParams1<P1 extends string> = Params1<P1>

type RequiredParams2<P1 extends string, P2 extends string> = Params2<P1, P2> | Params2<P2, P1>

// --------------------------------------------------------------------------------------------------------------------

const translations = {
	...T('HI', '{name}'),
	...T('Test', 'Ciao {name} {name}!'),
}

const it: Translation = createTranslation(translations)

export default it
