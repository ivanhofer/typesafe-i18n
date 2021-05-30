import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import { i18nObject } from '../src/util.object'
import { i18nString } from '../src/util.string'

const test = suite('core')

const LLL = i18nString('en')

test('string hi', () => assert.is(LLL('Welcome'), 'Welcome'))

test('string with param', () => assert.is(LLL('Hi {0}', 'John'), 'Hi John'))

test('string with keyed param', () => assert.is(LLL('Hi {name}', { name: 'John' }), 'Hi John'))

test('string plural 0', () => assert.is(LLL('{0} apple{{s}}', 0), '0 apples'))
test('string plural 1', () => assert.is(LLL('{0} apple{{s}}', 1), '1 apple'))
test('string plural 5', () => assert.is(LLL('{0} apple{{s}}', 5), '5 apples'))

test('trim plural 1', () => assert.is(LLL('{{ singular | plural }}', 1), 'singular'))
test('trim plural 2', () => assert.is(LLL('{{ singular | plural }}', 2), 'plural'))

test('trim plural only 1', () => assert.is(LLL('{{ this is plural }}', 1), ''))
test('trim plural only 2', () => assert.is(LLL('{{ this is plural }}', 2), 'this is plural'))

test('trim singular only 1', () => assert.is(LLL('{{ this is singular | }}', 1), 'this is singular'))
test('trim singular only 2', () => assert.is(LLL('{{ this is singular | }}', 2), ''))

test('plural part before key', () => assert.is(LLL('apple{{s}}: {nrOfApples:number}', { nrOfApples: 1 }), 'apple: 1'))

test('zero 0', () => assert.is(LLL('{{zero|one|other}}', 0), 'zero'))
test('zero 1', () => assert.is(LLL('{{zero|one|other}}', 1), 'one'))
test('zero 5', () => assert.is(LLL('{{zero|one|other}}', 5), 'other'))

test('plural ?? 3', () => assert.is(LLL('{{zero|one|?? items}}', 3), '3 items'))
test('plural ?? 7 7', () => assert.is(LLL('{{zero|one|?? items ??}}', 7), '7 items 7'))

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

//@ts-ignore
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

test.run()
