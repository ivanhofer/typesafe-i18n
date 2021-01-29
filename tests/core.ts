import { suite } from 'uvu'
import * as assert from 'uvu/assert'

import { langaugeObjectWrapper, langaugeStringWrapper } from '../src/index'

const test = suite('core')

const LL = langaugeStringWrapper('en')

test('string hi', () => assert.is(LL('Welcome'), 'Welcome'))

test('string with param', () => assert.is(LL('Hi {0}', 'John'), 'Hi John'))

test('string with keyed param', () => assert.is(LL('Hi {name}', { name: 'John' }), 'Hi John'))

test('string plural 0', () => assert.is(LL('{0} apple{{s}}', 0), '0 apples'))
test('string plural 1', () => assert.is(LL('{0} apple{{s}}', 1), '1 apple'))
test('string plural 5', () => assert.is(LL('{0} apple{{s}}', 5), '5 apples'))

test('trim plural 1', () => assert.is(LL('{{ singular | plural }}', 1), 'singular'))
test('trim plural 2', () => assert.is(LL('{{ singular | plural }}', 2), 'plural'))

test('trim plural only 1', () => assert.is(LL('{{ this is plural }}', 1), ''))
test('trim plural only 2', () => assert.is(LL('{{ this is plural }}', 2), 'this is plural'))

test('trim singular only 1', () => assert.is(LL('{{ this is singular | }}', 1), 'this is singular'))
test('trim singular only 2', () => assert.is(LL('{{ this is singular | }}', 2), ''))

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
}

const LLL = langaugeObjectWrapper('en', translation)

//@ts-ignore
test('wrong key', () => assert.is(LLL.WRONG_KEY(), 'WRONG_KEY'))

test('no param', () => assert.is(LLL.NO_PARAM(), translation.NO_PARAM))

test('empty', () => assert.is(LLL.EMPTY(), ''))

test('trim key', () => assert.is(LLL.TRIM_KEY('test'), 'test'))
test('trim param', () => assert.is(LLL.TRIM_PARAM(' Ho '), 'HeyHo'))

test('same param number', () => assert.is(LLL.SAME_PARAM(1), '1 1 1'))
test('same param string', () => assert.is(LLL.SAME_PARAM('1'), '1 1 1'))
test('same keyed param', () => assert.is(LLL.SAME_KEYED_PARAM({ name: 'test' }), 'test test test'))

test('param', () => assert.is(LLL.PARAM('hi'), 'hi'))

test('param but empty', () => assert.is(LLL.PARAM(), ''))
test('param but empty multiple', () => assert.is(LLL.SAME_PARAM(), '  '))

// --------------------------------------------------------------------------------------------------------------------

test('trim plural one', () => assert.is(LLL.TRIM_PLURAL({ key: 1 }), '1'))
test('trim plural other', () => assert.is(LLL.TRIM_PLURAL({ key: 2 }), '2'))

test('plural 0', () => assert.is(LLL.PLURAL(0), 'apples'))
test('plural 1', () => assert.is(LLL.PLURAL(1), 'apple'))
test('plural 2', () => assert.is(LLL.PLURAL(2), 'apples'))

test('singular-plural 0', () => assert.is(LLL.SINGULAR_PLURAL(0), '0 Äpfel'))
test('singular-plural 1', () => assert.is(LLL.SINGULAR_PLURAL(1), '1 Apfel'))
test('singular-plural 2', () => assert.is(LLL.SINGULAR_PLURAL(2), '2 Äpfel'))

test('multiple params', () => assert.is(LLL.MULTIPLE_PARAMS(1, 2), '1 2'))

test('multiple params plural', () => assert.is(LLL.MULTIPLE_PARAMS_PLURAL(1, 2), '1 banana and 2 apples'))

test('only plural true', () => assert.is(LLL.ONLY_PLURAL(true), ''))
test('only plural false', () => assert.is(LLL.ONLY_PLURAL(false), 'plural'))

test('only singular plural true', () => assert.is(LLL.ONLY_SINGULAR_PLURAL(true), 'singular'))
test('only singular plural false', () => assert.is(LLL.ONLY_SINGULAR_PLURAL(false), 'plural'))

test('only singular true', () => assert.is(LLL.ONLY_SINGULAR(true), 'singular'))
test('only singular false', () => assert.is(LLL.ONLY_SINGULAR(false), ''))

// --------------------------------------------------------------------------------------------------------------------

const LLL2 = langaugeObjectWrapper('ar-EG', {
	ADVANCED_PLURAL: '{{zero|one|two|few|many|other}}',
})

test('advanced plural rule 0', () => assert.is(LLL2.ADVANCED_PLURAL(0), 'zero'))
test('advanced plural rule 1', () => assert.is(LLL2.ADVANCED_PLURAL(1), 'one'))
test('advanced plural rule 2', () => assert.is(LLL2.ADVANCED_PLURAL(2), 'two'))
test('advanced plural rule 6', () => assert.is(LLL2.ADVANCED_PLURAL(6), 'few'))
test('advanced plural rule 18', () => assert.is(LLL2.ADVANCED_PLURAL(18), 'many'))
test('advanced plural rule "test"', () => assert.is(LLL2.ADVANCED_PLURAL('test'), 'other'))

test.run()
