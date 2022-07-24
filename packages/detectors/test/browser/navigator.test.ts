import type { Locale } from '@typesafe-i18n/runtime/core.mjs'
import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import { navigatorDetector } from '../../src/detectors/browser/navigator'

const test = suite('detector:navigator')

// --------------------------------------------------------------------------------------------------------------------

const testDetector = (name: string, languages: string[] | undefined, expected: Locale[]) =>
	test(`navigator ${name}`, () => {
		globalThis.navigator = { languages: languages as string[] } as unknown as Navigator
		assert.equal(navigatorDetector(), expected)
	})

testDetector('undefined', undefined, [])

testDetector('empty', [], [])

testDetector('single value', ['de-AT'], ['de-AT'])

testDetector('multiple values', ['de', 'en-US', 'en', 'it'], ['de', 'en-US', 'en', 'it'])

// --------------------------------------------------------------------------------------------------------------------

test.run()
