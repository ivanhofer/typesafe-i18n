import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import { i18nString } from '../src/util.string'

const test = suite('util.string')

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

test.run()
