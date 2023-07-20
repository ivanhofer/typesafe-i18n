import type { BaseTranslation } from 'packages/runtime/src/core.mjs'
import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import { extendDictionary } from './index.mjs'

const test = suite('utils')

const translation = {
	simple: 'Hello',
	nested: { value: 'Hello nested' },
}

test('does no mutation', () => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const base = {} as any
	extendDictionary(base, { hey: 'there' })
	assert.not(base.hey)
})

test('empty base', () => {
	const extended = extendDictionary({}, { hey: 'there' })
	assert.equal(extended, {
		hey: 'there',
	})
})

test('empty part', () => {
	const extended = extendDictionary({ hey: 'there' }, {})
	assert.equal(extended, {
		hey: 'there',
	})
})

test('simple extend', () => {
	const extended = extendDictionary(translation, { simple: 'Hello extended' })
	assert.equal(extended, {
		simple: 'Hello extended',
		nested: {
			value: 'Hello nested',
		},
	})
})

test('nested extend', () => {
	const extended = extendDictionary(translation, { nested: { value: 'Hello nested extended' } })
	assert.equal(extended, {
		simple: 'Hello',
		nested: {
			value: 'Hello nested extended',
		},
	})
})

test('nested extend with simple', () => {
	const extended = extendDictionary(translation, {
		simple: 'Hello extended',
		nested: { value: 'Hello nested extended' },
	})
	assert.equal(extended, {
		simple: 'Hello extended',
		nested: {
			value: 'Hello nested extended',
		},
	})
})

test('add prop', () => {
	const extended = extendDictionary<BaseTranslation, BaseTranslation>(translation, {
		add: 'test',
	})

	assert.equal(extended, {
		simple: 'Hello',
		add: 'test',
		nested: {
			value: 'Hello nested',
		},
	})
})

test('add nested prop', () => {
	const extended = extendDictionary<BaseTranslation, BaseTranslation>(translation, {
		add: {
			nested: 'test',
		},
	})

	assert.equal(extended, {
		simple: 'Hello',
		add: {
			nested: 'test',
		},
		nested: {
			value: 'Hello nested',
		},
	})
})

test('array', () => {
	const extended = extendDictionary<BaseTranslation, BaseTranslation>(
		{},
		{
			add: ['hey'],
		},
	)
	assert.equal(extended, {
		add: ['hey'],
	})

	const extended2 = extendDictionary<BaseTranslation, BaseTranslation>(extended, {
		add: ['ho'],
	})

	assert.equal(extended2, {
		add: ['ho'],
	})
})

test.run()
