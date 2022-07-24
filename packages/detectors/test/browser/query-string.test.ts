import type { Locale } from '@typesafe-i18n/runtime/core.mjs'
import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import { initQueryStringDetector } from '../../src/detectors/browser/query-string'

const test = suite('detector:query-string')

// --------------------------------------------------------------------------------------------------------------------

const testDetector = (
	name: string,
	queryString: string | undefined,
	expected: Locale[],
	parameterName: string | undefined = undefined,
) =>
	test(`query-string ${name}`, () => {
		globalThis.location = { search: queryString as string } as Location
		const detector = initQueryStringDetector(parameterName)
		assert.equal(detector(), expected)
	})

testDetector('undefined', undefined, [])

testDetector('empty', '', [])

testDetector('single value', '?lang=de-AT', ['de-AT'])

testDetector('single value with custom key', '?locale=en-US', ['en-US'], 'locale')

testDetector('single value with custom key not specified', '?locale=fr', [])

testDetector('single value with wrong custom key not specified', '?lang=fr', [], 'locale')

testDetector('multiple values', '?id=123&lang=it', ['it'])

testDetector('multiple values with custom key', '?param=test123&user-lang=es', ['es'], 'user-lang')

testDetector('multiple values without lang', '?param-1=some-value&param2=another-value', [])

// --------------------------------------------------------------------------------------------------------------------

test.run()
