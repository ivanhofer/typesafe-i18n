import type { Locale } from '../../core/src/core'

import { suite } from 'uvu'
import * as assert from 'uvu/assert'

import { initLocalStorageDetector } from '../src/detectors/localstorage-detector'

const test = suite('detector:localStorage')

// --------------------------------------------------------------------------------------------------------------------

const testDetector = (
	name: string,
	items: Record<string, string> | undefined,
	expected: Locale[],
	itemKey: string | undefined = undefined,
) =>
	test(`localStorage ${name}`, () => {
		//@ts-ignore
		globalThis.window = {
			localStorage: {
				getItem: (key: string) => items?.[key],
			} as Storage,
		}

		const detector = initLocalStorageDetector(itemKey)
		assert.equal(detector(), expected)
	})

testDetector('undefined', undefined, [])

testDetector('empty', {}, [])

testDetector('single value', { locale: 'de-AT' }, ['de-AT'])

testDetector('single value with custom key', { lang: 'en-US' }, ['en-US'], 'lang')

testDetector('single value with custom key not specified', { lang: 'fr' }, [])

testDetector('single value with wrong custom key not specified', { locale: 'fr' }, [], 'lang')

testDetector(
	'multiple values',
	{
		id: '1234',
		locale: 'it',
	},
	['it'],
)

testDetector('multiple values with custom key', { param: 'test123', 'user-lang': 'es' }, ['es'], 'user-lang')

testDetector('multiple values without lang', { param1: 'some-value', param2: 'another-value' }, [])

// --------------------------------------------------------------------------------------------------------------------

test.run()
