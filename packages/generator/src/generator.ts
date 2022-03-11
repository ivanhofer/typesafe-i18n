import { execSync } from 'child_process'
import { watch } from 'chokidar'
import { resolve } from 'path'
import ts from 'typescript'
import { getConfigWithDefaultValues, readConfig } from '../../config/src/config'
import type { GeneratorConfig, GeneratorConfigWithDefaultValues } from '../../config/src/types'
import type { BaseTranslation } from '../../runtime/src'
import type { Locale } from '../../runtime/src/core'
import { generate } from './generate-files'
import { configureOutputHandler, shouldGenerateJsDoc } from './output-handler'
import { getAllLocales, parseLanguageFile } from './parse-language-file'
import { createPathIfNotExits } from './utils/file.utils'
import { parseTypescriptVersion, TypescriptVersion } from './utils/generator.utils'
import { createLogger, Logger } from './utils/logger'
import { findAllNamespacesForLocale } from './utils/namespaces.utils'

let logger: Logger
let firstRunOfGenerator = true

const getBaseTranslations = async (
	{ baseLocale, tempPath, outputPath, typesFileName }: GeneratorConfigWithDefaultValues,
	namespaces: string[],
): Promise<BaseTranslation> => {
	const translations =
		(await parseLanguageFile(outputPath, typesFileName, resolve(tempPath, `${debounceCounter}`), baseLocale)) || {}

	for await (const namespace of namespaces) {
		const namespaceTranslations =
			(await parseLanguageFile(
				outputPath,
				typesFileName,
				resolve(tempPath, `${debounceCounter}`),
				baseLocale,
				namespace,
			)) || {}

		;(translations as Record<string, BaseTranslation>)[namespace] = namespaceTranslations
	}

	return translations
}

const runCommandAfterGenerator = (runAfterGenerator: string) => {
	logger.info(`running command '${runAfterGenerator}'`)

	const output = execSync(runAfterGenerator).toString()
	logger.info(
		'output: \n>\n' +
			output
				.split('\n')
				.map((line) => `> ${line}`)
				.join('\n'),
	)
}

const parseAndGenerate = async (config: GeneratorConfigWithDefaultValues, version: TypescriptVersion) => {
	if (disableChangeDetection) return

	const currentDebounceCounter = debounceCounter
	disableChangeDetection = true

	if (firstRunOfGenerator) {
		firstRunOfGenerator = false
	} else {
		logger.info('files were modified => looking for changes ...')
	}

	const { baseLocale, outputPath, runAfterGenerator } = config

	const locales = await getAllLocales(outputPath)
	const namespaces = findAllNamespacesForLocale(baseLocale, outputPath)

	const firstLaunchOfGenerator = !locales.length

	const translations = await getBaseTranslations(config, namespaces)

	await generate(translations, { ...config, baseLocale }, version, logger, firstLaunchOfGenerator, locales, namespaces)

	if (firstLaunchOfGenerator) {
		let message =
			'Visit https://github.com/ivanhofer/typesafe-i18n#options and configure `typesafe-i18n` depending on your project-setup.'
		if (!config.adapter) {
			message += " You probably want to set at least the 'adapter' option."
		}

		logger.warn(message)
	}

	runAfterGenerator && runCommandAfterGenerator(runAfterGenerator)

	logger.info('... all files are up to date')

	setTimeout(() => currentDebounceCounter === debounceCounter && (disableChangeDetection = false), 1000)
}

let debounceCounter = 0
let disableChangeDetection = false

const debounce = (callback: () => void) =>
	setTimeout(
		(i) => {
			i === debounceCounter && callback()
		},
		100,
		++debounceCounter,
	)

export const startGenerator = async (config?: GeneratorConfig, watchFiles = true): Promise<void> => {
	logger = createLogger(console, !watchFiles)

	const parsedConfig = {
		...(await readConfig()),
		...config,
	}

	const configWithDefaultValues = await getConfigWithDefaultValues(parsedConfig)
	const { outputPath } = configWithDefaultValues

	const version = parseTypescriptVersion(ts.versionMajorMinor)
	configureOutputHandler(configWithDefaultValues, version)

	const onChange = parseAndGenerate.bind(null, configWithDefaultValues, version)

	await createPathIfNotExits(outputPath)

	watchFiles && watch(outputPath).on('all', () => !disableChangeDetection && debounce(onChange))

	logger.info(
		`generating files for ${
			shouldGenerateJsDoc ? 'JavaScript with JSDoc notation' : `TypeScript version: '${ts.versionMajorMinor}.x'`
		}`,
	)
	logger.info(`options:`, parsedConfig)
	watchFiles && logger.info(`watcher started in: '${outputPath}'`)

	if (!watchFiles) {
		await onChange()
		logger.info(`generating files completed`)
	}
}
