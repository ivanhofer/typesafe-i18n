import { promises } from 'fs'
import { suite } from 'uvu'
import * as assert from 'uvu/assert'

import type { LangaugeBaseTranslation } from '../src'
import { generate, GenerateTypesConfig } from '../src/types-generator/generator'

const { readFile } = promises

const test = suite('types')

const outputPath = 'tests/generated/'

const createConfig = (prefix: string, config?: Partial<GenerateTypesConfig>): GenerateTypesConfig => ({
	outputPath,
	typesFile: prefix + '.types.actual.output',
	utilFile: prefix + '.util.actual.output',
	...config,
})

const getPathOfOutputFile = (prefix: string, file: 'types' | 'util', type: 'actual' | 'expected') =>
	`${outputPath}${prefix}.${file}.${type}.output`

const REGEX_WHITESPACE = /[\s]+/g
const removeWhitespace = (text: string) => text.replace(REGEX_WHITESPACE, '')

const check = async (prefix: string, file: 'types' | 'util') => {
	const expected = (await readFile(getPathOfOutputFile(prefix, file, 'expected'))).toString()
	const actual = (await readFile(getPathOfOutputFile(prefix, file, 'actual'))).toString()
	assert.match(removeWhitespace(expected), removeWhitespace(actual))
}

const wrapTest = async (prefix: string, translation: LangaugeBaseTranslation, config?: Partial<GenerateTypesConfig>) =>
	test(`types ${prefix}`, async () => {
		await generate(translation, createConfig(prefix, config))
		await check(prefix, 'types')
		await check(prefix, 'util')
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

// withFormatters -----------------------------------------------------------------------------------------------------

wrapTest('withFormatters', {
	FORMATTER_1: '{0|timesTen} apple{{s}}',
	FORMATTER_2: '{0} apple{{s}} and {1|wrapWithHtmlSpan} banana{{s}}',
})

test.run()

// deLocales ----------------------------------------------------------------------------------------------------------

wrapTest('deLocale', {}, { baseLocale: 'de' })

// multipleLocales ----------------------------------------------------------------------------------------------------

wrapTest('multipleLocales', {}, { locales: ['de', 'en', 'it'] })

// argTypes -----------------------------------------------------------------------------------------------------------

wrapTest('argTypes', { STRING_TYPE: 'Hi {name:string}!', NUMBER_TYPE: '{0:number} apple{{s}}' })

// formatterWithDifferentArgTypes -------------------------------------------------------------------------------------

wrapTest('formatterWithDifferentArgTypes', { A: '{0:number|calculate}!', B: '{0:Date|calculate}' })

// argTypesWithExternalType -------------------------------------------------------------------------------------------

wrapTest('argTypesWithExternalType', { EXTERNAL_TYPE: 'The result is {0:Result|calculate}!' })

test.run()
