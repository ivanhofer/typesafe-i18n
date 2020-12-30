import { promises } from 'fs'
import { suite } from 'uvu'
import * as assert from 'uvu/assert'

import type { LangaugeBaseTranslation } from '../src'
import type { GenerateTypesConfig } from '../src/types-generator/generator'
import { generateTypes } from '../src'

const { readFile } = promises

const test = suite('types')

const outputPath = 'tests/types/'

const createConfig = (prefix: string): GenerateTypesConfig => ({ outputPath, outputFile: prefix + '_actual.output' })

const getPathOfOutputFile = (prefix: string, type: 'actual' | 'expected') => `${outputPath}${prefix}_${type}.output`

const REGEX_WHITESPACE = /[\s]+/g
const removeWhitespace = (text: string) => text.replace(REGEX_WHITESPACE, '')

const check = async (prefix: string) => {
	const expected = (await readFile(getPathOfOutputFile(prefix, 'expected'))).toString()
	const actual = (await readFile(getPathOfOutputFile(prefix, 'actual'))).toString()
	assert.match(removeWhitespace(expected), removeWhitespace(actual))
}

const wrapTest = async (prefix: string, translation: LangaugeBaseTranslation) =>
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
	KEYED_PARAM: '{nrOfApples} apple{{s}}',
	KEYED_PARAMS: '{nrOfApples} apple{{s}} and {nrOfBananas} banana{{s}}',
})

// withFormatters ---------------------------------------------------------------------------------------------------------

wrapTest('withFormatters', {
	FORMATTER_1: '{0|timesTen} apple{{s}}',
	FORMATTER_2: '{0} apple{{s}} and {1|wrapWithHtmlSpan} banana{{s}}',
})

test.run()
