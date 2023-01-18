import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import { parseRawText } from './basic.mjs'

const test = suite('parseRawText')

test('string only', () => {
	assert.equal(parseRawText('Hello'), ['Hello'])
})

test('parameter', () => {
	assert.equal(parseRawText('Hello {name}'), ['Hello ', { k: 'name', f: [] }, ''])
})

test('parameter with type', () => {
	assert.equal(parseRawText('Hello {name:string}!', false), [
		'Hello ',
		{ k: 'name', i: 'string', n: false, f: [] },
		'!',
	])
})

test('parameter with type and formatter', () => {
	assert.equal(parseRawText('Hello {name:string|uppercase}!', false), [
		'Hello ',
		{ k: 'name', i: 'string', n: false, f: ['uppercase'] },
		'!',
	])
})

test('parameter with type and multiple formatters', () => {
	assert.equal(parseRawText('Hello {name:string|trim|uppercase}!', false), [
		'Hello ',
		{ k: 'name', i: 'string', n: false, f: ['trim', 'uppercase'] },
		'!',
	])
})

test.run()
