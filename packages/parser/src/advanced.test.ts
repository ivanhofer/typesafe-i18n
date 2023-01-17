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
			transforms: [],
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
			transforms: [],
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
			transforms: [],
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
			transforms: [],
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
			transforms: [],
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
			transforms: [],
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
			transforms: [],
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
			transforms: [],
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
			transforms: [],
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
			transforms: [],
		},
		{
			kind: 'text',
			content: "'",
		},
	] satisfies ParsedMessage)
})

// --------------------------------------------------------------------------------------------------------------------

test('plural rules only', () => {
	assert.equal(parseMessage('Project{{s}}'), [
		{
			kind: 'text',
			content: 'Project',
		},
		{
			kind: 'plural',
			key: '0',
			one: '',
			other: 's',
		},
	] satisfies ParsedMessage)
})

test('plural rules with index-based parameter', () => {
	assert.equal(parseMessage('{0} {{Project|Projects}}'), [
		{
			kind: 'parameter',
			key: '0',
			type: 'unknown',
			optional: false,
			transforms: [],
		},
		{
			kind: 'text',
			content: ' ',
		},
		{
			kind: 'plural',
			key: '0',
			one: 'Project',
			other: 'Projects',
		},
	] satisfies ParsedMessage)
})

test('plural rules with key-based parameter', () => {
	assert.equal(parseMessage('{ nr: number } {{ Project | Projects }}'), [
		{
			kind: 'parameter',
			key: 'nr',
			type: 'number',
			optional: false,
			transforms: [],
		},
		{
			kind: 'text',
			content: ' ',
		},
		{
			kind: 'plural',
			key: 'nr',
			one: 'Project',
			other: 'Projects',
		},
	] satisfies ParsedMessage)
})

test('plural rules singular-only', () => {
	assert.equal(parseMessage('{0} weitere{{s|}} Mitglied{{er}}'), [
		{
			kind: 'parameter',
			key: '0',
			type: 'unknown',
			optional: false,
			transforms: [],
		},
		{
			kind: 'text',
			content: ' weitere',
		},
		{
			kind: 'plural',
			key: '0',
			one: 's',
			other: '',
		},
		{
			kind: 'text',
			content: ' Mitglied',
		},
		{
			kind: 'plural',
			key: '0',
			one: '',
			other: 'er',
		},
	] satisfies ParsedMessage)
})

test('plural zero-one-other', () => {
	assert.equal(parseMessage('The list includes {{ no items | an item | ?? items }}'), [
		{
			kind: 'text',
			content: 'The list includes ',
		},
		{
			kind: 'plural',
			key: '0',
			zero: 'no items',
			one: 'an item',
			other: '?? items',
		},
	] satisfies ParsedMessage)
})

test('plural full syntax', () => {
	assert.equal(parseMessage('I have {{zero|one|two|a few|many|a lot}} apple{{s}}'), [
		{
			kind: 'text',
			content: 'I have ',
		},
		{
			kind: 'plural',
			key: '0',
			zero: 'zero',
			one: 'one',
			two: 'two',
			few: 'a few',
			many: 'many',
			other: 'a lot',
		},
		{
			kind: 'text',
			content: ' apple',
		},
		{
			kind: 'plural',
			key: '0',
			one: '',
			other: 's',
		},
	] satisfies ParsedMessage)
})

// --------------------------------------------------------------------------------------------------------------------

test('index-based parameter with formatter', () => {
	assert.equal(parseMessage('Hello {0|uppercase}!'), [
		{
			kind: 'text',
			content: 'Hello ',
		},
		{
			kind: 'parameter',
			key: '0',
			type: 'unknown',
			optional: false,
			transforms: [
				{
					kind: 'formatter',
					name: 'uppercase',
				},
			],
		},
		{
			kind: 'text',
			content: '!',
		},
	] satisfies ParsedMessage)
})

test('key-based parameter with formatter', () => {
	assert.equal(parseMessage('{date:Date|dateTime}'), [
		{
			kind: 'parameter',
			key: 'date',
			type: 'Date',
			optional: false,
			transforms: [
				{
					kind: 'formatter',
					name: 'dateTime',
				},
			],
		},
	] satisfies ParsedMessage)
})

test('parameter with multiple formatters', () => {
	assert.equal(parseMessage('{date:Date|dateTime|upperCase|trim}'), [
		{
			kind: 'parameter',
			key: 'date',
			type: 'Date',
			optional: false,
			transforms: [
				{
					kind: 'formatter',
					name: 'dateTime',
				},
				{
					kind: 'formatter',
					name: 'upperCase',
				},
				{
					kind: 'formatter',
					name: 'trim',
				},
			],
		},
	] satisfies ParsedMessage)
})

test('multiple parameters with multiple formatters', () => {
	assert.equal(parseMessage('Hi {name: string | upper}, today is: {date: Date | dateTime}'), [
		{
			kind: 'text',
			content: 'Hi ',
		},
		{
			kind: 'parameter',
			key: 'name',
			type: 'string',
			optional: false,
			transforms: [
				{
					kind: 'formatter',
					name: 'upper',
				},
			],
		},
		{
			kind: 'text',
			content: ', today is: ',
		},
		{
			kind: 'parameter',
			key: 'date',
			type: 'Date',
			optional: false,
			transforms: [
				{
					kind: 'formatter',
					name: 'dateTime',
				},
			],
		},
	] satisfies ParsedMessage)
})

// --------------------------------------------------------------------------------------------------------------------

test.run()
