import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import { parseMessage } from './parse.mjs'
import { serializeMessage } from './serialize.mjs'

const test = suite('serializeMessage')

const strings = [
	// basics
	'Hello World!',
	// parameters
	'Hello {0}!',
	'Hello {1} and {0}',
	'hi {name}',
	'{name1} and {0} are here!',
	'Total {0:number}',
	'Today is {date:Date}',
	"User {name:string} has the email address: '{0:EmailString}'",
	// plural rules
	'Project{{s}}',
	'{0} {{Project|Projects}}',
	'{nr:number} {{Project|Projects}}',
	'{0} weitere{{s|}} Mitglied{{er}}',
	'The list includes {{no items|an item|?? items}}',
	'I have {{zero|one|two|a few|many|a lot}} apple{{s}}',
	// // formatters
	// 'Hello {0|uppercase}!',
	// '{date:Date|dateTime}',
	// '{date:Date|dateTime|upperCase|trim}',
	// 'Hi {name: string | upper}, today is: {date: Date | dateTime}',
	// // switch-case
	// '{username:string} added a new photo to {gender|{ male: his, female: her, *: their }} stream.',
	// 'Price: ${price:number}. {taxes|{yes: An additional tax will be collected. , no: No taxes apply.}}',
]

strings.forEach((string) => {
	test(string, () => {
		assert.equal(serializeMessage(parseMessage(string)), string)
	})
})

test.run()
