import { watch } from 'chokidar'
import { resolve } from 'path'
import * as ts from 'typescript'
import type { BaseTranslation } from '../../core/src/core'
import {
	copyFile,
	createPathIfNotExits,
	deleteFolderRecursive,
	doesPathExist,
	getFiles,
	importFile
} from './file-utils'
import { generate, GeneratorConfig, GeneratorConfigWithDefaultValues, getConfigWithDefaultValues, readConfig } from './generate-files'
import { logger, parseTypescriptVersion, TypescriptVersion } from './generator-util'
import { configureOutputHandler, fileEnding, shouldGenerateJsDoc } from './output-handler'

const getAllLanguages = async (path: string) => {
	const files = await getFiles(path, 1)
	return files.filter(({ folder, name }) => folder && name === `index${fileEnding}`).map(({ folder }) => folder)
}

const transpileTypescriptAndPrepareImportFile = async (languageFilePath: string, tempPath: string): Promise<string> => {
	const program = ts.createProgram([languageFilePath], { outDir: tempPath })
	program.emit()

	const compiledPath = resolve(tempPath, 'index.js')
	const copyPath = resolve(tempPath, `i18n-temp-${debounceCounter}.js`)

	const copySuccess = await copyFile(compiledPath, copyPath, false)
	if (!copySuccess) {
		logger.warn(
			`Make sure to give your base locales default export the type of 'BaseTranslation' and don't import anything from outside the base locales directory via relative path.`,
		)
		return ''
	}

	return copyPath
}

const parseLanguageFile = async (
	outputPath: string,
	locale: string,
	tempPath: string,
): Promise<BaseTranslation | null> => {
	const originalPath = resolve(outputPath, locale, `index${fileEnding}`)

	if (!(await doesPathExist(originalPath))) {
		logger.info(`could not load base locale file '${locale}'`)
		return null
	}

	!shouldGenerateJsDoc && await createPathIfNotExits(tempPath)

	const importPath = shouldGenerateJsDoc
		? originalPath
		: await transpileTypescriptAndPrepareImportFile(originalPath, tempPath)

	if (!importPath) {
		return null
	}

	const languageImport = await importFile<BaseTranslation>(importPath)

	!shouldGenerateJsDoc && await deleteFolderRecursive(tempPath)

	if (!languageImport) {
		logger.error(`could not read default export from language file '${locale}'`)
		return null
	}

	return languageImport
}

let first = true

const parseAndGenerate = async (config: GeneratorConfigWithDefaultValues, version: TypescriptVersion) => {
	if (first) {
		first = false
	} else {
		logger.info('files were modified => looking for changes ...')
	}

	const { baseLocale: locale, tempPath, outputPath } = config

	const locales = await getAllLanguages(outputPath)

	const languageFile =
		(locale && (await parseLanguageFile(outputPath, locale, tempPath))) || {}

	await generate(languageFile, { ...config, baseLocale: locale, locales }, version, logger)

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
	const configWithDefaultValues = await getConfigWithDefaultValues(config)
	const { outputPath } = configWithDefaultValues

	const version = parseTypescriptVersion(ts.versionMajorMinor)
	configureOutputHandler(configWithDefaultValues, version)

	const onChange = parseAndGenerate.bind(null, configWithDefaultValues, version)

	await createPathIfNotExits(outputPath)

	watchFiles && watch(outputPath).on('all', () => debounce(onChange))

	logger.info(`generating files for ${shouldGenerateJsDoc
		? 'JavaScript with JSDoc notation'
		: `TypeScript version: '${ts.versionMajorMinor}.x'`}`
	)
	logger.info(`options:`, await readConfig(config))
	watchFiles && logger.info(`watcher started in: '${outputPath}'`)

	if (!watchFiles) {
		await onChange()
		logger.info(`generating files completed`)
	}
}
