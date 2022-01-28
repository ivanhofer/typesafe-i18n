import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import { getFallbackProxy } from '../src/core-utils'

const test = suite('fallback')

const LL = getFallbackProxy()

// @ts-expect-error
test('nothing', () => assert.is(LL(), ''))
// @ts-expect-error
test('property', () => assert.is(LL.test(), 'test'))
// @ts-expect-error
test('nested', () => assert.is(LL.nested.test(), 'nested.test'))
// @ts-expect-error
test('array', () => assert.is(LL[0](), '0'))
test('array length', () => assert.is(LL.length, 0))
// @ts-expect-error
test('array nested', () => assert.is(LL.test[0](), 'test.0'))
// @ts-expect-error
test('array nested length', () => assert.is(LL.test.length, 0))

test.run()
