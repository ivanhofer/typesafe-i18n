import { identity } from 'svelte/internal'
import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import { i18nObject } from '../src/util.object'

const test = suite('util.object')

// --------------------------------------------------------------------------------------------------------------------

const translation = {
	NO_PARAM: 'This is a test.',
	PARAM: '{0}',
	TRIM_KEY: '{ 0 }',
	TRIM_PARAM: 'Hey{0}',
	TRIM_PLURAL: '{{ key : 1 | 2 }}',
	PLURAL: 'apple{{s}}',
	SINGULAR_PLURAL: '{0} {{Apfel|Äpfel}}',
	MULTIPLE_PARAMS: '{0} {1}',
	PARAMS_WITH_SPACES: '{ test param 1 } {test param2}',
	MULTIPLE_PARAMS_PLURAL: '{0} banana{{s}} and {1} apple{{s}}',
	EMPTY: '',
	SAME_PARAM: '{0} {0} {0}',
	SAME_KEYED_PARAM: '{name} {name} {name}',
	ONLY_PLURAL: '{{plural}}',
	ONLY_SINGULAR_PLURAL: '{{singular|plural}}',
	ONLY_SINGULAR: '{{singular|}}',
	ZERO: '{{zero|one|other}}',
	PLURAL_VALUE: '{{ no items | one item | ?? items }}',
}

const LL = i18nObject('en', translation)

//@ts-expect-error
test('wrong key', () => assert.is(LL.WRONG_KEY(), 'WRONG_KEY'))

test('no param', () => assert.is(LL.NO_PARAM(), translation.NO_PARAM))

test('empty', () => assert.is(LL.EMPTY(), ''))

test('trim key', () => assert.is(LL.TRIM_KEY('test'), 'test'))
test('trim param', () => assert.is(LL.TRIM_PARAM(' Ho '), 'HeyHo'))

test('same param number', () => assert.is(LL.SAME_PARAM(1), '1 1 1'))
test('same param string', () => assert.is(LL.SAME_PARAM('1'), '1 1 1'))
test('same keyed param', () => assert.is(LL.SAME_KEYED_PARAM({ name: 'test' }), 'test test test'))

test('param', () => assert.is(LL.PARAM('hi'), 'hi'))

test('param but empty', () => assert.is(LL.PARAM(), ''))
test('param but empty multiple', () => assert.is(LL.SAME_PARAM(), '  '))

// --------------------------------------------------------------------------------------------------------------------

test('trim plural one', () => assert.is(LL.TRIM_PLURAL({ key: 1 }), '1'))
test('trim plural other', () => assert.is(LL.TRIM_PLURAL({ key: 2 }), '2'))

test('plural 0', () => assert.is(LL.PLURAL(0), 'apples'))
test('plural 1', () => assert.is(LL.PLURAL(1), 'apple'))
test('plural 2', () => assert.is(LL.PLURAL(2), 'apples'))

test('singular-plural 0', () => assert.is(LL.SINGULAR_PLURAL(0), '0 Äpfel'))
test('singular-plural 1', () => assert.is(LL.SINGULAR_PLURAL(1), '1 Apfel'))
test('singular-plural 2', () => assert.is(LL.SINGULAR_PLURAL(2), '2 Äpfel'))

test('multiple params', () => assert.is(LL.MULTIPLE_PARAMS(1, 2), '1 2'))
test('params with spaces', () => assert.is(LL.PARAMS_WITH_SPACES({ 'test param 1': '1', 'test param2': '2' }), '1 2'))

test('multiple params plural', () => assert.is(LL.MULTIPLE_PARAMS_PLURAL(1, 2), '1 banana and 2 apples'))

test('only plural true', () => assert.is(LL.ONLY_PLURAL(true), ''))
test('only plural false', () => assert.is(LL.ONLY_PLURAL(false), 'plural'))

test('only singular plural true', () => assert.is(LL.ONLY_SINGULAR_PLURAL(true), 'singular'))
test('only singular plural false', () => assert.is(LL.ONLY_SINGULAR_PLURAL(false), 'plural'))

test('only singular true', () => assert.is(LL.ONLY_SINGULAR(true), 'singular'))
test('only singular false', () => assert.is(LL.ONLY_SINGULAR(false), ''))

test('zero 0', () => assert.is(LL.ZERO(0), 'zero'))
test('zero 1', () => assert.is(LL.ZERO(1), 'one'))
test('zero 7', () => assert.is(LL.ZERO(7), 'other'))

test('plural zero: no', () => assert.is(LL.PLURAL_VALUE(0), 'no items'))
test('plural zero: one', () => assert.is(LL.PLURAL_VALUE(1), 'one item'))
test('plural zero: ??', () => assert.is(LL.PLURAL_VALUE(99), '99 items'))

// --------------------------------------------------------------------------------------------------------------------

const LL2 = i18nObject('ar-EG', {
	ADVANCED_PLURAL: '{{zero|one|two|few|many|other}}',
})

test('advanced plural rule 0', () => assert.is(LL2.ADVANCED_PLURAL(0), 'zero'))
test('advanced plural rule 1', () => assert.is(LL2.ADVANCED_PLURAL(1), 'one'))
test('advanced plural rule 2', () => assert.is(LL2.ADVANCED_PLURAL(2), 'two'))
test('advanced plural rule 6', () => assert.is(LL2.ADVANCED_PLURAL(6), 'few'))
test('advanced plural rule 18', () => assert.is(LL2.ADVANCED_PLURAL(18), 'many'))
test('advanced plural rule "test"', () => assert.is(LL2.ADVANCED_PLURAL('test'), 'other'))

// --------------------------------------------------------------------------------------------------------------------

const LL3 = i18nObject('en', {
	z: 'nested 0',
	a: { b: 'nested 1' },
	d: {
		e: { f: 'nested 2' },
	},
	o: {
		p: {
			q: {
				r: {
					s: {
						t: { u: 'nested 3' },
					},
				},
			},
		},
	},
})

test('nested 0', () => assert.is(LL3.z(), 'nested 0'))
test('nested 1', () => assert.is(LL3.a.b(), 'nested 1'))
test('nested 2', () => assert.is(LL3.d.e.f(), 'nested 2'))
test('nested 3', () => assert.is(LL3.o.p.q.r.s.t.u(), 'nested 3'))

// --------------------------------------------------------------------------------------------------------------------

const LL4 = i18nObject('en', [{ HI: 'test-1' }, { HO: 'test-2' }] as const)

test('array root 0', () => assert.is(LL4[0].HI(), 'test-1'))
test('array root 1', () => assert.is(LL4[1].HO(), 'test-2'))

const LL5 = i18nObject('en', { test1: [{ a: 'test-a' }, { b: 'test-b' }, { c: 'test-c' }, { d: 'test-d' }] } as const)

test('array nested 0', () => assert.is(LL5.test1['0'].a(), 'test-a'))
test('array nested 3', () => assert.is(LL5.test1['3'].d(), 'test-d'))

const LL6 = i18nObject('en', {
	test1: [{ a: 'test-a', a1: ['test', { aa1: 'test-aa1' }] }],
} as const)

test('array deeply nested 0.a1.a', () => assert.is(LL6.test1[0].a1[0](), 'test'))
test('array deeply nested 0.a1.[1].aa1', () => assert.is(LL6.test1[0].a1[1].aa1(), 'test-aa1'))

const LL7 = i18nObject('en', ['test-1', 'test-2'] as const)

test('array root strings', () => assert.is(LL7[0](), 'test-1'))
test('array root strings', () => assert.is(LL7[1](), 'test-2'))

// --------------------------------------------------------------------------------------------------------------------

const LL8 = i18nObject(
	'en',
	{
		identity: '{0|identity}',
		trim: '{ 0 | ignore }',
		chaining: '{ value | addA | addB | addC }',
		order: '{ value | addC | addA | identity | addB }',
	},
	{
		identity: (value) => value,
		ignore: () => '',
		addA: (value) => `${value}A`,
		addB: (value) => `${value}B`,
		addC: (value) => `${value}C`,
	},
)

test('formatter identity', () => assert.is(LL8.identity('test'), 'test'))
test('formatter trim', () => assert.is(LL8.trim('test'), ''))
test('formatter chaining', () => assert.is(LL8.chaining({ value: '' }), 'ABC'))
test('formatter order', () => assert.is(LL8.order({ value: '' }), 'CAB'))

// --------------------------------------------------------------------------------------------------------------------

const LL9 = i18nObject(
	'en',
	{
		switch1: '{0|{yes:JA,no:NEIN}}',
		keyed: '{option|{yes:JA,no:NEIN}}',
		switch2: '{0| {  yes : JA , no : NEIN }}',
		switchFormatter: '{0|{y: yes, n: no }|uppercase}',
		formatterSwitch: '{0|uppercase|{Y: yes, N: no }}',
		formatterSwitchFormatter: '{0|uppercase| {Y: yes, N: no } | uppercase }',
		number: '{0|{1: one, 2: two}}',
		fallback: '{0|{yes:JA, * : NEIN}}',
		emptyNoFallback: '{0|{test:, * : nothing}}',
		spacesInKey: '{0|{a b c: begin, *:rest}}',
		dashesInKey: '{0|{a-b-c: begin, *:rest}}',
		withType: '{0:string|{y:yes,n:no}}',
	},
	{
		uppercase: (v: string) => v.toUpperCase(),
	},
)

test('switch-case yes no', () => assert.is(LL9.switch1('yes'), 'JA'))
test('switch-case keyed', () => assert.is(LL9.keyed({ option: 'yes' }), 'JA'))
test('switch-case trim', () => assert.is(LL9.switch2('no'), 'NEIN'))
test('switch-case wrong key', () => assert.is(LL9.switch1('test'), 'test'))
test('switch-case switch formatter', () => assert.is(LL9.switchFormatter('y'), 'YES'))
test('switch-case formatter switch', () => assert.is(LL9.formatterSwitch('n'), 'no'))
test('switch-case formatter switch formatter', () => assert.is(LL9.formatterSwitchFormatter('n'), 'NO'))
test('switch-case number', () => assert.is(LL9.number('1'), 'one'))
test('switch-case fallback', () => assert.is(LL9.fallback('something'), 'NEIN'))
test('switch-case fallback empty', () => assert.is(LL9.emptyNoFallback('test'), ''))
test('switch-case spaces in key', () => assert.is(LL9.spacesInKey('a b c'), 'begin'))
test('switch-case dashes in key', () => assert.is(LL9.dashesInKey('a-b-c'), 'begin'))
test('switch-case with type', () => assert.is(LL9.withType('y'), 'yes'))

// --------------------------------------------------------------------------------------------------------------------

test.run()
