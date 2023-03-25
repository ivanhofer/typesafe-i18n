import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import type { Locale } from '../../runtime/src/core.mjs'
import { detectLocale, type LocaleDetector } from './detect.mjs'

const test = suite('detector')

// --------------------------------------------------------------------------------------------------------------------

const testDetector = (
	name: string,
	baseLocale: Locale,
	availableLocales: Locale[],
	detectors: LocaleDetector[] | undefined,
	expected: Locale,
) =>
	test(name, () => {
		const detected = detectLocale(baseLocale, availableLocales, ...(detectors || []))
		assert.equal(detected, expected)
	})

// --------------------------------------------------------------------------------------------------------------------

testDetector('no detector', 'de', ['de', 'de-AT', 'de-CH'], undefined, 'de')

testDetector('empty detector', 'de', ['de', 'de-AT', 'de-CH'], [() => []], 'de')

testDetector('detect de-AT', 'de', ['de', 'de-AT', 'de-CH'], [() => ['de-AT']], 'de-AT')

testDetector('detect de when de-AT', 'de', ['de'], [() => ['de-AT']], 'de')

testDetector('detect de when wrong casing', 'de', ['de'], [() => ['EN', 'DE']], 'de')

testDetector('detect IT when wrong casing', 'it', ['de', 'IT', 'it'], [() => ['en-US', 'it']], 'IT')

testDetector('detect de when locale split', 'it', ['en', 'en-GB', 'it'], [() => ['en-US', 'it']], 'en')

testDetector('detect wrong locales', 'de', ['de', 'de-AT', 'de-CH'], [() => ['fr', 'en']], 'de')

testDetector('detect not first locale', 'de', ['de', 'de-AT', 'de-CH'], [() => ['fr', 'en', 'de-CH']], 'de-CH')

testDetector('detect in 2nd detector', 'de', ['de'], [() => ['fr', 'en', 'de-CH'], () => ['de']], 'de')

testDetector('detect in 3rd detector', 'de', ['de'], [() => [], () => ['ru'], () => ['en-US', 'de']], 'de')

test.run()
