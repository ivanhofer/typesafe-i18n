import { Headers } from 'node-fetch'
import { isNotUndefined } from 'typesafe-utils'
import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import type { Locale } from '../../../../runtime/src/core.mjs'
import { initAcceptLanguageHeaderDetector } from './accept-language-header.mjs'

const test = suite('detector:accept-language-header')

// --------------------------------------------------------------------------------------------------------------------

const testDetector = (
	name: string,
	acceptLanguageHeaderValue: string | undefined,
	expected: Locale[],
	headerName = 'accept-language',
) =>
	test(`accept-language-header ${name}`, () => {
		const headers = new Headers()
		if (isNotUndefined(acceptLanguageHeaderValue)) {
			headers.set(headerName, acceptLanguageHeaderValue)
		}
		const detector = initAcceptLanguageHeaderDetector({ headers })
		assert.equal(detector(), expected)
	})

testDetector('undefined', undefined, [])

testDetector('empty', '', [])

testDetector('single value without weight', 'de-CH', ['de-CH'])

testDetector('multiple values', 'de, de-AT;q=0.9, en;q=0.8', ['de', 'de-AT', 'en'])

testDetector('multiple values without weight', 'en-US,fr-CA', ['en-US', 'fr-CA'])

testDetector('multiple values with weight', 'en-US,en;q=0.9', ['en-US', 'en'])

testDetector('multiple values with *', 'fr-CH, fr;q=0.9, en;q=0.8, de;q=0.7, *;q=0.5', ['fr-CH', 'fr', 'en', 'de'])

testDetector('* only', '*', [])

testDetector(
	'multiple values with weight and uppercased header name',
	'en-US,en;q=0.9',
	['en-US', 'en'],
	'ACCEPT-LANGUAGE',
)

testDetector(
	'multiple values with * and capitalized Header name',
	'fr-CH, fr;q=0.9, en;q=0.8, de;q=0.7, *;q=0.5',
	['fr-CH', 'fr', 'en', 'de'],
	'Accept-Language',
)

// --------------------------------------------------------------------------------------------------------------------

test.run()
