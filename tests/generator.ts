import { promises } from 'fs'
import { suite } from 'uvu'
import * as assert from 'uvu/assert'

import type { BaseTranslation } from '../src'
import { GeneratorConfig, GeneratorConfigWithDefaultValues } from '../src/generator/generator'
import { generate, setDefaultConfigValuesIfMissing } from '../src/generator/generator'
import { parseTypescriptVersion, TypescriptVersion } from '../src/generator/generator-util'

const { readFile } = promises

const test = suite('types')

const outputPath = 'tests/generated/'

const actualPostfix = '.actual.output'

const defaultVersion = parseTypescriptVersion('4.1')

const getFileName = (name: string) => name + actualPostfix

const createConfig = (prefix: string, config?: GeneratorConfig): GeneratorConfigWithDefaultValues =>
	setDefaultConfigValuesIfMissing({
		outputPath: outputPath + prefix,

		typesFileName: getFileName('types'),
		utilFileName: getFileName('util'),
		formattersTemplateFileName: getFileName('formatters-template'),
		typesTemplateFileName: getFileName('types-template'),

		...config,
		locales: config?.locales?.length ? config?.locales : [config?.baseLocale || 'en'],
	})

type FileToCheck = 'types' | 'util' | 'formatters-template' | 'types-template' | 'svelte'

const getPathOfOutputFile = (prefix: string, file: FileToCheck, type: 'actual' | 'expected') =>
	`${outputPath}${prefix}/${file}.${type}.output`

const REGEX_NEW_LINE = /\n/g
const check = async (prefix: string, file: FileToCheck) => {
	let expected = ''
	let actual = ''

	try {
		expected = (await readFile(getPathOfOutputFile(prefix, file, 'expected'))).toString()
		actual = (await readFile(getPathOfOutputFile(prefix, file, 'actual'))).toString()
	} catch {
		return
	}

	if (expected && actual) {
		const expectedSplitByLines = expected.split(REGEX_NEW_LINE)
		const actualSplitByLines = actual.split(REGEX_NEW_LINE)

		expectedSplitByLines.forEach((_, i) =>
			assert.match(expectedSplitByLines[i] as string, actualSplitByLines[i] as string),
		)
	}
}

const testGeneratedOutput = async (
	prefix: string,
	translation: BaseTranslation,
	config: GeneratorConfig = {},
	version: TypescriptVersion = defaultVersion,
) =>
	test(`generate ${prefix}`, async () => {
		await generate(translation, createConfig(prefix, config), version, undefined, true)
		await check(prefix, 'types')
		await check(prefix, 'util')
		await check(prefix, 'formatters-template')
		await check(prefix, 'types-template')
		await check(prefix, 'svelte')
	})

// --------------------------------------------------------------------------------------------------------------------

type ConsoleOutputs = {
	info: string[]
	warn: string[]
	error: string[]
}

const mockLogger = () => {
	const outputs: ConsoleOutputs = {
		info: [],
		warn: [],
		error: [],
	}

	const logger = (type: 'info' | 'warn' | 'error', ...messages: unknown[]) => outputs[type].push(messages.join(' '))

	return {
		get logger() {
			return {
				info: logger.bind(null, 'info'),
				warn: logger.bind(null, 'warn'),
				error: logger.bind(null, 'error'),
			}
		},
		get outputs() {
			return outputs
		},
	}
}

const testGeneratedConsoleOutput = async (
	prefix: string,
	translation: BaseTranslation,
	callback: (outputs: ConsoleOutputs) => Promise<void>,
) =>
	test(`console ${prefix}`, async () => {
		const loggerWrapper = mockLogger()

		await generate(translation, createConfig(prefix, {}), defaultVersion, loggerWrapper.logger)

		await callback(loggerWrapper.outputs)
	})

// --------------------------------------------------------------------------------------------------------------------

testGeneratedOutput('empty', {})

testGeneratedOutput('simple', {
	TEST: 'This is a test',
})

testGeneratedOutput('withParams', {
	PARAM: '{0} apple{{s}}',
	PARAMS: '{0} apple{{s}} and {1} banana{{s}}',
})

testGeneratedOutput('keyedParams', {
	KEYED_PARAM: '{nrOfApples} apple{{s}}',
	KEYED_PARAMS: '{nrOfApples} apple{{s}} and {nrOfBananas} banana{{s}}',
})

testGeneratedOutput('withFormatters', {
	FORMATTER_1: '{0|timesTen} apple{{s}}',
	FORMATTER_2: '{0} apple{{s}} and {1|wrapWithHtmlSpan} banana{{s}}',
})

testGeneratedOutput('deLocale', {}, { baseLocale: 'de' })

testGeneratedOutput('multipleLocales', {}, { locales: ['de', 'en', 'it'] })

testGeneratedOutput('LocaleWithDash', {}, { baseLocale: 'de-at' })
testGeneratedOutput('LocaleWithDashSync', {}, { baseLocale: 'de-at', loadLocalesAsync: false })
testGeneratedOutput('LocalesWithDash', {}, { locales: ['it-it', 'en-us', 'fr-be'] })

testGeneratedOutput('argTypes', { STRING_TYPE: 'Hi {name:string}!', NUMBER_TYPE: '{0:number} apple{{s}}' })

testGeneratedOutput('argOrder', {
	ORDER_INDEX: '{1} {0} {2} {0}',
	ORDER_KEYED: '{b} {z} {a}',
	ORDER_FORMATTER: '{0|z} {1|a}',
	ORDER_TYPES: '{0:B} {1:A}',
})

testGeneratedOutput('formatterWithDifferentArgTypes', { A: '{0:number|calculate}!', B: '{0:Date|calculate}' })

testGeneratedOutput('argTypesWithExternalType', { EXTERNAL_TYPE: 'The result is {0:Result|calculate}!' })

testGeneratedOutput('same-param', { SAME_PARAM: '{0} {0} {0}' })

testGeneratedOutput('same-keyed-param', { SAME_KEYED_PARAM: '{name} {name} {name}' })

testGeneratedOutput('only-plural-rules', { ONLY_PLURAL: 'apple{{s}}', ONLY_SINGULAR_PLURAL: '{{Afpel|Äpfel}}' })

testGeneratedOutput('plural-part-before-key', { PLURAL_BEFORE_KEY: 'apple{{s}}: {nrOfApples:number}' })

// --------------------------------------------------------------------------------------------------------------------

const nodeAdapterFileName = getFileName('node')

testGeneratedOutput(
	'adapter_node_async',
	{ HELLO_NODE: 'Hi {0:name}' },
	{ adapter: 'node', adapterFileName: nodeAdapterFileName },
)

testGeneratedOutput(
	'adapter_node_sync',
	{ HELLO_NODE: 'Hi {0:name}' },
	{ adapter: 'node', adapterFileName: nodeAdapterFileName, loadLocalesAsync: false },
)

const svelteAdapterFileName = getFileName('svelte')

testGeneratedOutput(
	'adapter_svelte-async',
	{ HELLO_SVELTE: 'Hi {0}' },
	{ adapter: 'svelte', adapterFileName: svelteAdapterFileName },
)

testGeneratedOutput(
	'adapter_svelte-sync',
	{ HELLO_SVELTE: 'Hi {0}' },
	{ adapter: 'svelte', adapterFileName: svelteAdapterFileName, loadLocalesAsync: false },
)

const reactAdapterFileName = getFileName('react')

testGeneratedOutput(
	'adapter_react_async',
	{ HELLO_NODE: 'Hi {0:name}' },
	{ adapter: 'react', adapterFileName: reactAdapterFileName },
)

testGeneratedOutput(
	'adapter_react_sync',
	{ HELLO_NODE: 'Hi {0:name}' },
	{ adapter: 'react', adapterFileName: reactAdapterFileName, loadLocalesAsync: false },
)

// --------------------------------------------------------------------------------------------------------------------

const tsTestTranslation = { TEST: 'Hi {name}, I have {nrOfApples} {{Afpel|Äpfel}}' }

testGeneratedOutput('typescript3.0', tsTestTranslation, {}, parseTypescriptVersion('3.0'))
testGeneratedOutput('typescript3.8', tsTestTranslation, {}, parseTypescriptVersion('3.8'))
testGeneratedOutput('typescript4.1', tsTestTranslation, {}, parseTypescriptVersion('4.1'))

// --------------------------------------------------------------------------------------------------------------------

testGeneratedConsoleOutput('consoleNoTranslations', {}, async (outputs) => {
	assert.is(outputs.info.length, 0)
	assert.is(outputs.error.length, 0)
	assert.is(outputs.warn.length, 0)
})

testGeneratedConsoleOutput('consoleWrongIndex', { TEST: '{0} {2}' }, async (outputs) => {
	assert.is(outputs.info.length, 0)
	assert.is(outputs.error.length, 0)
	assert.is(outputs.warn.length, 2)
	assert.is(outputs.warn[0], "translation 'TEST' => argument {1} expected, but {2} found")
	assert.is(outputs.warn[1], "translation 'TEST' => make sure to not skip an index")
})

testGeneratedConsoleOutput('consoleKeyedAndIndexBasedKeys', { TEST: '{hi} {0}' }, async (outputs) => {
	assert.is(outputs.info.length, 0)
	assert.is(outputs.error.length, 0)
	assert.is(outputs.warn.length, 2)
	assert.is(outputs.warn[0], "translation 'TEST' => argument {1} expected, but {hi} found")
	assert.is(outputs.warn[1], "translation 'TEST' => you can't mix keyed and index-based args")
})

test.run()
