import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import { parseMessage } from './parse.mjs'
import { serializeMessage } from './serialize.mjs'

const test = suite('serializeMessage')

const strings = ['Hello', 'Hello {0}!', 'Hello {name:string}!']

strings.forEach((string) => {
	test(string, () => {
		assert.equal(serializeMessage(parseMessage(string)), string)
	})
})

test.run()
