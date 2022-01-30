import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import type { Locale } from '../../runtime/src/core'
import { initDocumentCookieDetector } from '../../src/detectors/browser/document-cookie'

const test = suite('detector:document-cookie')

// --------------------------------------------------------------------------------------------------------------------

const testDetector = (
	name: string,
	cookieValue: string | undefined,
	expected: Locale[],
	cookieName: string | undefined = undefined,
) =>
	test(`document-cookie ${name}`, () => {
		globalThis.document = { cookie: cookieValue } as Document
		const detector = initDocumentCookieDetector(cookieName)
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
