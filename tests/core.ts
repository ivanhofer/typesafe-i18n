import { suite } from 'uvu'
import * as assert from 'uvu/assert'

import { langauge } from '../src/index'

const test = suite('core')

const translation = {
	NO_PARAM: 'This is a test.',
	PARAM: '{0}',
	TRIM_KEY: '{ 0 }',
	TRIM_PARAM: 'Hey{0}',
	PLURAL: 'apple{{s}}',
	SINGULAR_PLURAL: '{0} {{Apfel|Äpfel}}',
	MULTIPLE_PARAMS: '{0} {1}',
	MULTIPLE_PARAMS_PLURAL: '{0} banana{{s}} and {1} apple{{s}}',
	EMPTY: '',
}

const LLL = langauge(translation)

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
test('wrong key', () => assert.is(LLL.WRONG_KEY(), 'WRONG_KEY'))

test('no param', () => assert.is(LLL.NO_PARAM(), translation.NO_PARAM))

test('empty', () => assert.is(LLL.EMPTY(), ''))

test('trim key', () => assert.is(LLL.TRIM_KEY('test'), 'test'))
test('trim param', () => assert.is(LLL.TRIM_PARAM(' Ho '), 'HeyHo'))

test('param', () => assert.is(LLL.PARAM('hi'), 'hi'))

test('param but empty', () => assert.is(LLL.PARAM(), ''))

test('plural 0', () => assert.is(LLL.PLURAL(0), 'apples'))
test('plural 1', () => assert.is(LLL.PLURAL(1), 'apple'))
test('plural 2', () => assert.is(LLL.PLURAL(2), 'apples'))

test('singular-plural 0', () => assert.is(LLL.SINGULAR_PLURAL(0), '0 Äpfel'))
test('singular-plural 1', () => assert.is(LLL.SINGULAR_PLURAL(1), '1 Apfel'))
test('singular-plural 2', () => assert.is(LLL.SINGULAR_PLURAL(2), '2 Äpfel'))

test('multiple params', () => assert.is(LLL.MULTIPLE_PARAMS(1, 2), '1 2'))

test('multiple params plural', () => assert.is(LLL.MULTIPLE_PARAMS_PLURAL(1, 2), '1 banana and 2 apples'))

test.run()
