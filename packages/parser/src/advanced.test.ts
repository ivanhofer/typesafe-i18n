import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import { ParsedMessage, parseMessage } from './advanced.mjs'

const test = suite('parseMessage')

// --------------------------------------------------------------------------------------------------------------------

test('simple string', () => {
	assert.equal(parseMessage('Hello World!'), [
		{
			kind: 'text',
			content: 'Hello World!',
		},
	] satisfies ParsedMessage)
})

// --------------------------------------------------------------------------------------------------------------------

test('index-based parameter', () => {
	assert.equal(parseMessage('Hello {0}!'), [
		{
			kind: 'text',
			content: 'Hello ',
		},
		{
			kind: 'parameter',
			key: '0',
			type: 'unknown',
			optional: false,
		},
		{
			kind: 'text',
			content: '!',
		},
	] satisfies ParsedMessage)
})

test('index-based parameters', () => {
	assert.equal(parseMessage('Hello {1} and {0}'), [
		{
			kind: 'text',
			content: 'Hello ',
		},
		{
			kind: 'parameter',
			key: '1',
			type: 'unknown',
			optional: false,
		},
		{
			kind: 'text',
			content: ' and ',
		},
		{
			kind: 'parameter',
			key: '0',
			type: 'unknown',
			optional: false,
		},
	] satisfies ParsedMessage)
})

test('key-based parameter', () => {
	assert.equal(parseMessage('hi {name}'), [
		{
			kind: 'text',
			content: 'hi ',
		},
		{
			kind: 'parameter',
			key: 'name',
			type: 'unknown',
			optional: false,
		},
	] satisfies ParsedMessage)
})

test('mixed parameters', () => {
	assert.equal(parseMessage('{name1} and {0} are here!'), [
		{
			kind: 'parameter',
			key: 'name1',
			type: 'unknown',
			optional: false,
		},
		{
			kind: 'text',
			content: ' and ',
		},
		{
			kind: 'parameter',
			key: '0',
			type: 'unknown',
			optional: false,
		},
		{
			kind: 'text',
			content: ' are here!',
		},
	] satisfies ParsedMessage)
})

// --------------------------------------------------------------------------------------------------------------------

test('index-based parameter wit type', () => {
	assert.equal(parseMessage('Total {0:number}'), [
		{
			kind: 'text',
			content: 'Total ',
		},
		{
			kind: 'parameter',
			key: '0',
			type: 'number',
			optional: false,
		},
	] satisfies ParsedMessage)
})

test('key-based parameter with type', () => {
	assert.equal(parseMessage('Today is {date: Date}'), [
		{
			kind: 'text',
			content: 'Today is ',
		},
		{
			kind: 'parameter',
			key: 'date',
			type: 'Date',
			optional: false,
		},
	] satisfies ParsedMessage)
})

test('mixed parameters with types', () => {
	assert.equal(parseMessage("User { name:string } has the email address: '{0:EmailString}'"), [
		{
			kind: 'text',
			content: 'User ',
		},
		{
			kind: 'parameter',
			key: 'name',
			type: 'string',
			optional: false,
		},
		{
			kind: 'text',
			content: " has the email address: '",
		},
		{
			kind: 'parameter',
			key: '0',
			type: 'EmailString',
			optional: false,
		},
		{
			kind: 'text',
			content: "'",
		},
	] satisfies ParsedMessage)
})

// --------------------------------------------------------------------------------------------------------------------

test.run()
