import { promises } from 'fs'
import { suite } from 'uvu'
import * as assert from 'uvu/assert'

import type { LangaugeBaseTranslation } from '../src'
import { DEFAULT_LOCALE } from '../src/constants/constants'
import { GeneratorConfig, GeneratorConfigWithDefaultValues } from '../src/types-generator/generator'
import { generate, setDefaultConfigValuesIfMissing } from '../src/types-generator/generator'

const { readFile } = promises

const test = suite('types')

const outputPath = 'tests/generated/'

const actualPostfix = '.actual.output'

const getFileName = (prefix: string, name: string) => prefix + '/' + name + actualPostfix

const createConfig = (prefix: string, config?: GeneratorConfig): GeneratorConfigWithDefaultValues =>
	setDefaultConfigValuesIfMissing({
		outputPath,

		typesFileName: getFileName(prefix, 'types'),
		utilFileName: getFileName(prefix, 'util'),
		formattersTemplateFileName: getFileName(prefix, 'formatters-template'),
		typesTemplateFileName: getFileName(prefix, 'types-template'),

		...config,
		locales: config?.locales?.length ? config?.locales : [config?.baseLocale || DEFAULT_LOCALE],
	})

type FileToCheck = 'types' | 'util' | 'formatters-template' | 'types-template' | 'svelte'

const getPathOfOutputFile = (prefix: string, file: FileToCheck, type: 'actual' | 'expected') =>
	`${outputPath}${prefix}/${file}.${type}.output`

const REGEX_WHITESPACE = /[\s]+/g
const removeWhitespace = (text: string) => text.replace(REGEX_WHITESPACE, '')

const check = async (prefix: string, file: FileToCheck) => {
	let expected = ''
	let actual = ''

	try {
		expected = (await readFile(getPathOfOutputFile(prefix, file, 'expected'))).toString()
		actual = (await readFile(getPathOfOutputFile(prefix, file, 'actual'))).toString()
		// eslint-disable-next-line no-empty
	} catch { }

	if (expected && actual) {
		assert.match(removeWhitespace(expected), removeWhitespace(actual))
	}
}

const wrapTest = async (prefix: string, translation: LangaugeBaseTranslation, config: GeneratorConfig = {}) =>
	test(`types ${prefix}`, async () => {
		await generate(translation, createConfig(prefix, config))
		await check(prefix, 'types')
		await check(prefix, 'util')
		await check(prefix, 'formatters-template')
		await check(prefix, 'types-template')
		await check(prefix, 'svelte')
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

// svelte async -------------------------------------------------------------------------------------------------------

wrapTest('svelte-async', { HELLO_SVELTE: 'Hi {0}' }, { svelte: getFileName('svelte-async', 'svelte') })

// svelte sync --------------------------------------------------------------------------------------------------------

wrapTest('svelte-sync', { HELLO_SVELTE: 'Hi {0}' }, { svelte: getFileName('svelte-sync', 'svelte'), lazyLoad: false })

// same param ---------------------------------------------------------------------------------------------------------

wrapTest('same-param', { SAME_PARAM: '{0} {0} {0}' })

// same keyed param ---------------------------------------------------------------------------------------------------

wrapTest('same-keyed-param', { SAME_KEYED_PARAM: '{name} {name} {name}' })

test.run()
