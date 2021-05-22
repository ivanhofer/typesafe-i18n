import type { Locale } from '../../core/src/core'

import { suite } from 'uvu'
import * as assert from 'uvu/assert'

import { initAcceptLanguageHeaderDetector } from '../src/detectors/accept-language-header'
import { isNotUndefined } from 'typesafe-utils'

const test = suite('detector:accept-language-header')

// --------------------------------------------------------------------------------------------------------------------

const testDetector = (name: string, acceptLanguageHeaderValue: string | undefined, expected: Locale[]) =>
	test(`accept-language-header ${name}`, () => {
		const headers = {} as { 'accept-language': string }
		if (isNotUndefined(acceptLanguageHeaderValue)) {
			headers['accept-language'] = acceptLanguageHeaderValue as string
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

// --------------------------------------------------------------------------------------------------------------------

test.run()
