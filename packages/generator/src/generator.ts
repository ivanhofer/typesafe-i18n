import { watch } from 'chokidar'
import { sync as glob } from 'glob'
import { resolve } from 'path'
import ts from 'typescript'
import { getConfigWithDefaultValues, readConfig } from '../../config/src/config'
import type { GeneratorConfig, GeneratorConfigWithDefaultValues } from '../../config/src/types'
import type { BaseTranslation } from '../../runtime/src'
import type { Locale } from '../../runtime/src/core'
import { createPathIfNotExits } from './file-utils'
import { generate } from './generate-files'
import { createLogger, Logger, parseTypescriptVersion, TypescriptVersion } from './generator-util'
import { configureOutputHandler, shouldGenerateJsDoc } from './output-handler'
import { getAllLanguages, parseLanguageFile } from './parse-language-file'

let logger: Logger
let first = true

const findAllNamespaces = (baseLocale: Locale, outputPath: string): string[] =>
	glob(`${outputPath}/${baseLocale}/*/index.*s`).map((file) => {
		// TODO: check if this split also works for windows-paths
		const parts = file.split('/')
		return parts[parts.length - 2] as string
	})

const getBaseTranslations = async (
	baseLocale: Locale,
	tempPath: string,
	outputPath: string,
	namespaces: string[],
): Promise<BaseTranslation> => {
	const translations = (await parseLanguageFile(outputPath, resolve(tempPath, `${debounceCounter}`), baseLocale)) || {}

	for await (const namespace of namespaces) {
		const namespaceTranslations =
			(await parseLanguageFile(outputPath, resolve(tempPath, `${debounceCounter}`), baseLocale, namespace)) || {}

		;(translations as Record<string, BaseTranslation>)[namespace] = namespaceTranslations
	}

	return translations
}

const parseAndGenerate = async (config: GeneratorConfigWithDefaultValues, version: TypescriptVersion) => {
	if (first) {
		first = false
	} else {
		logger.info('files were modified => looking for changes ...')
	}

	const { baseLocale, tempPath, outputPath } = config

	const locales = await getAllLanguages(outputPath)
	const namespaces = findAllNamespaces(baseLocale, outputPath)

	const firstLaunchOfGenerator = !locales.length

	const translations = await getBaseTranslations(baseLocale, tempPath, outputPath, namespaces)

	await generate(translations, { ...config, baseLocale }, version, logger, firstLaunchOfGenerator, locales, namespaces)

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
