import type { Locale } from '@typesafe-i18n/runtime/core.mjs'
import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import { initRequestCookiesDetector } from '../../src/detectors/server/request-cookies.mts'

const test = suite('detector:request-cookies')

// --------------------------------------------------------------------------------------------------------------------

type Request = {
	cookies: string
}

const testDetector = (
	name: string,
	cookieValue: string | undefined,
	expected: Locale[],
	cookieName: string | undefined = undefined,
) =>
	test(`request-cookies ${name}`, () => {
		const req = { cookies: cookieValue } as Request
		const detector = initRequestCookiesDetector(req, cookieName)
		assert.equal(detector(), expected)
	})

testDetector('undefined', undefined, [])

testDetector('empty', '', [])

testDetector('single value', 'lang=de-AT', ['de-AT'])

testDetector('single value with custom key', 'locale=en-US', ['en-US'], 'locale')

testDetector('single value with custom key not specified', 'locale=fr', [])

testDetector('single value with wrong custom key not specified', 'lang=fr', [], 'locale')

testDetector('multiple values', '_ga=weTrackYouEverywhere;lang=it', ['it'])

testDetector('multiple values with custom key', 'cookie=test123;user-lang=es', ['es'], 'user-lang')

testDetector('multiple values without lang', 'cookie1=some-value;cookie2=another-value', [])

// --------------------------------------------------------------------------------------------------------------------

test.run()
