import { watch } from 'chokidar'
import { resolve } from 'path'
import * as ts from 'typescript'
import { createPathIfNotExits, getFiles } from './file-utils'
import {
	generate,
	GeneratorConfig,
	GeneratorConfigWithDefaultValues,
	getConfigWithDefaultValues,
	readConfig
} from './generate-files'
import { createLogger, Logger, parseTypescriptVersion, TypescriptVersion } from './generator-util'
import { configureOutputHandler, fileEnding, shouldGenerateJsDoc } from './output-handler'
import { parseLanguageFile } from './parse-language-file'

const getAllLanguages = async (path: string) => {
	const files = await getFiles(path, 1)
	return files.filter(({ folder, name }) => folder && name === `index${fileEnding}`).map(({ folder }) => folder)
}

let logger: Logger
let first = true

const parseAndGenerate = async (config: GeneratorConfigWithDefaultValues, version: TypescriptVersion) => {
	if (first) {
		first = false
	} else {
		logger.info('files were modified => looking for changes ...')
	}

	const { baseLocale: locale, tempPath, outputPath } = config

	const locales = await getAllLanguages(outputPath)

	const firstLaunchOfGenerator = !locales.length

	const languageFile =
		(locale && (await parseLanguageFile(outputPath, locale, resolve(tempPath, `${debounceCounter}`)))) || {}

	await generate(languageFile, { ...config, baseLocale: locale, locales }, version, logger, firstLaunchOfGenerator)

	if (firstLaunchOfGenerator) {
		let message =
			'Visit https://github.com/ivanhofer/typesafe-i18n#options and configure `typesafe-i18n` depending on your project-setup.'
		if (!config.adapter) {
			message += " You probably want to set at least the 'adapter' option."
		}

		logger.warn(message)
	}

	logger.info('... all files are up to date')
}

let debounceCounter = 0

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

	const parsedConfig = await readConfig(config)

	const configWithDefaultValues = await getConfigWithDefaultValues(parsedConfig)
	const { outputPath } = configWithDefaultValues

	const version = parseTypescriptVersion(ts.versionMajorMinor)
	configureOutputHandler(configWithDefaultValues, version)

	const onChange = parseAndGenerate.bind(null, configWithDefaultValues, version)

	await createPathIfNotExits(outputPath)

	watchFiles && watch(outputPath).on('all', () => debounce(onChange))

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
