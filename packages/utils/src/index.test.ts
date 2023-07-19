import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import { i18nObject } from '../../runtime/src/index.mjs'
import { extendDictionary } from './index.mjs'

const test = suite('utils')

const translation = {
	simple: 'Hello',
	nested: { value: 'Hello nested' },
}

test('simple extend', () => {
	const extended = extendDictionary(translation, { simple: 'Hello extended' })
	const LL = i18nObject('en', extended)
	assert.is(LL.simple(), 'Hello extended')
})
test('nested extend', () => {
	const extended = extendDictionary(translation, { nested: { value: 'Hello nested extended' } })
	const LL = i18nObject('en', extended)
	assert.is(LL.nested.value(), 'Hello nested extended')
})
test('nested extend with simple', () => {
	const extended = extendDictionary(translation, {
		simple: 'Hello extended',
		nested: { value: 'Hello nested extended' },
	})
	const LL = i18nObject('en', extended)
	assert.is(LL.simple(), 'Hello extended')
	assert.is(LL.nested.value(), 'Hello nested extended')
})

test.run()
