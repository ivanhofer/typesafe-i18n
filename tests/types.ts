import { promises } from 'fs'
import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import type { TranslationObject } from '../src/types'

import { generateTypes } from '../src/types-generator'

const { readFile } = promises

const test = suite('types')

const path = 'tests/types/'

const createConfig = (prefix: string) => ({ path, file: prefix + '_actual.output' })

const getPathOfOutputFile = (prefix: string, type: 'actual' | 'expected') => `${path}${prefix}_${type}.output`

const REGEX_WHITESPACE = /[\s]+/g
const removeWhitespace = (text: string) => text.replace(REGEX_WHITESPACE, '')

const check = async (prefix: string) => {
	const expected = (await readFile(getPathOfOutputFile(prefix, 'expected'))).toString()
	const actual = (await readFile(getPathOfOutputFile(prefix, 'actual'))).toString()
	assert.match(removeWhitespace(expected), removeWhitespace(actual))
}

const wrapTest = async (prefix: string, translation: TranslationObject) =>
	test(`types ${prefix}`, async () => {
		await generateTypes(translation, createConfig(prefix))
		await check(prefix)
	})

// empty --------------------------------------------------------------------------------------------------------------

wrapTest('empty', {})

// simple -------------------------------------------------------------------------------------------------------------

wrapTest('simple', {
	TEST: 'This is a test',
})

// withParams ---------------------------------------------------------------------------------------------------------

wrapTest('withParams', {
	PARAM: '{0} apple{{s}}',
	PARAMS: '{0} apple{{s}} and {1} banana{{s}}',
})

// keyedParams --------------------------------------------------------------------------------------------------------

wrapTest('keyedParams', {
	PARAM: '{nrOfApples} apple{{s}}',
	PARAMS: '{nrOfApples} apple{{s}} and {nrOfBananas} banana{{s}}',
})

// withFormatters ---------------------------------------------------------------------------------------------------------

wrapTest('withFormatters', {
	PARAM: '{0|timesTen} apple{{s}}',
	PARAMS: '{0} apple{{s}} and {1|wrapWithHtmlSpan} banana{{s}}',
})

test.run()
