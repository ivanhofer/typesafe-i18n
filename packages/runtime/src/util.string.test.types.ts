import type { LocalizedString } from '../src/core.mjs'
import { typesafeI18nString } from '../src/util.string.mjs'

{
	const LLL = typesafeI18nString('de')

	// - text-only -----------------------------------------------------------------------------------------------------
	LLL('test')
	// @ts-expect-error should not expect arguments
	LLL('', '')

	// - plural rules --------------------------------------------------------------------------------------------------
	// @ts-expect-error plural-only expects an argument
	LLL('apple{{s}}')
	LLL('apple{{s}}', true)
	LLL('{a} apple{{s}}', { a: 'test' })
	// @ts-expect-error wrong parameter passed with plural rule
	LLL('{as} apple{{s}}', { a: 'test' })

	// - index based arguments -----------------------------------------------------------------------------------------
	// ! currently to resource intensive to implement, use keyed arguments instead
	LLL('{0}', { 0: 123 })
	LLL('{0:number} {1}', { 0: 123, 1: 'asd' })

	// - single argument -----------------------------------------------------------------------------------------------
	LLL('{a}', { a: 123 })
	LLL('{a}', { a: '' })
	// @ts-expect-error expects argument
	LLL('{a}')
	// @ts-expect-error expects argument to be trimmed
	LLL('{ a }', { ' a ': '' })
	// @ts-expect-error expects only single argument
	LLL('{a}', { a: '', b: '' })
	LLL('{b}', { b: 123 })

	// - optional arguments --------------------------------------------------------------------------------------------
	// @ts-expect-error must pass an argument
	LLL('{a?}')
	LLL('{a?}', { a: 'test' })
	LLL('{a?}', {})
	LLL('{b?:string}', { b: undefined })
	LLL('{0?}', { 0: 'test' })

	// - multiple arguments --------------------------------------------------------------------------------------------
	LLL('{a}{b}', { a: '', b: 123 })
	// @ts-expect-error
	LLL('{a} {b}', { a: '' })
	// @ts-expect-error
	LLL(' {a} {b}', { a: '', c: 123 })
	LLL('{a}{b}{c}{d}{e}{f}{g}{h}', { a: '', b: '', c: '', d: '', e: '', f: '', g: '', h: '' })

	// - typed arguments -----------------------------------------------------------------------------------------------
	LLL('{a:string}', { a: '123' })
	// @ts-expect-error
	LLL('{a:string}', { a: 123 })
	LLL('{a:number}', { a: 123 })
	// @ts-expect-error
	LLL('{a:number}', { a: '123' })
	// @ts-expect-error
	LLL('{a:number[]}', { a: [123, ''] })
	LLL('{a:number[]}', { a: [123, 0] })
	LLL('{a:Array<number>}', { a: [123, 0] })
	// @ts-expect-error
	LLL('{a:Array<number>}', { a: [''] })
	LLL('{a:LocalizedString}', { a: '' as LocalizedString })

	// - trimming ------------------------------------------------------------------------------------------------------
	LLL('{a:string }', { a: '' })
	LLL('{a: string}', { a: '' })
	LLL('{a: string }', { a: '' })
}

{
	// - formatters ----------------------------------------------------------------------------------------------------
	const LLL = typesafeI18nString('en', { uppercase: (value: string) => value?.toUpperCase?.(), 'some-fn': () => '' })

	LLL('{a|uppercase}', { a: '' })
	// @ts-expect-error
	LLL('{a|test}', { a: '' })
	LLL('{a| uppercase }', { a: '' })
	LLL('{a| uppercase | some-fn }', { a: '' })
	// @ts-expect-error
	LLL('{a : number | uppercase | some-fn }', { a: '' })
	// @ts-expect-error
	LLL('{a:number | uppercase | test }', { a: 123 })

	// - switch-case ---------------------------------------------------------------------------------------------------
	LLL('Added a new photo to {gender|{male: his, female: her, *: their}} stream.', { gender: '' })
	// @ts-expect-error
	LLL('Added a new photo to {gender|{male: his, female: her}} stream.', { gender: '' })
	LLL('Added a new photo to {gender|{ male: his,female:her }} stream.', { gender: 'male' })
	LLL('Added a new photo to {gender|{male: his, female: her}|uppercase} stream.', { gender: 'male' })
	LLL('Added a new photo to {gender|uppercase|{male: his, female: her, *: their}} stream.', { gender: '' })
}
