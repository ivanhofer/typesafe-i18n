import type { Locale } from '../../core/src/core'

import { suite } from 'uvu'
import * as assert from 'uvu/assert'

import { initRequestParametersDetector } from '../src/detectors/request-parameters'
import { Request } from 'express'

const test = suite('detector:request-parameters')

// --------------------------------------------------------------------------------------------------------------------

const testDetector = (
	name: string,
	params: Record<string, string> | undefined,
	expected: Locale[],
	parameterName: string | undefined = undefined,
) =>
	test(`request-parameters ${name}`, () => {
		const req = { params } as Request
		const detector = initRequestParametersDetector(req, parameterName)
		assert.equal(detector(), expected)
	})

testDetector('undefined', undefined, [])

testDetector('empty', {}, [])

testDetector('single value', { lang: 'de-AT' }, ['de-AT'])

testDetector('single value with custom key', { locale: 'en-US' }, ['en-US'], 'locale')

testDetector('single value with custom key not specified', { locale: 'fr' }, [])

testDetector('single value with wrong custom key not specified', { lang: 'fr' }, [], 'locale')

testDetector(
	'multiple values',
	{
		id: '1234',
		lang: 'it',
	},
	['it'],
)

testDetector('multiple values with custom key', { param: 'test123', 'user-lang': 'es' }, ['es'], 'user-lang')

testDetector('multiple values without lang', { param1: 'some-value', param2: 'another-value' }, [])

// --------------------------------------------------------------------------------------------------------------------

test.run()
