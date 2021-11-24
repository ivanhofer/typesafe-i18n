import type { Request } from 'express'
import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import type { Locale } from '../../../runtime/src/core'
import { initRequestParametersDetector } from '../../src/detectors/server/request-parameters'

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
