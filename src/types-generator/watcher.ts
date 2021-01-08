import * as ts from 'typescript'
import fs from 'fs'
import { resolve } from 'path'
import type { LangaugeBaseTranslation } from '../core/core'
import type { GeneratorConfig, GeneratorConfigWithDefaultValues } from './generator'
import { copyFile, createPathIfNotExits, deleteFolderRecursive, getFiles, importFile } from './file-utils'
import { generate, setDefaultConfigValuesIfMissing } from './generator'

const getAllLanguages = async (path: string) => {
	const files = await getFiles(path, 1)
	return files.filter(({ folder, name }) => folder && name === 'index.ts').map(({ folder }) => folder)
}

const transpileTypescriptAndPrepareImportFile = async (languageFilePath: string, tempPath: string): Promise<string> => {
	const program = ts.createProgram([languageFilePath], { outDir: tempPath })
	program.emit()

	const compiledPath = resolve(tempPath, 'index.js')
	const copyPath = resolve(tempPath, `langauge-temp-${debounceIndex}.js`)

	const copySuccess = await copyFile(compiledPath, copyPath)
	if (!copySuccess) {
		// eslint-disable-next-line no-console
		console.error(`[LANGAUGE] ERROR: something went wrong`)
		return ''
	}

	return copyPath
}

const parseLanguageFile = async (
	outputPath: string,
	locale: string,
	tempPath: string,
): Promise<LangaugeBaseTranslation | null> => {
	const originalPath = resolve(outputPath, locale, 'index.ts')

	await createPathIfNotExits(tempPath)

	const importPath = await transpileTypescriptAndPrepareImportFile(originalPath, tempPath)
	if (!importPath) {
		return null
	}

	const languageImport = await importFile<LangaugeBaseTranslation>(importPath)

	await deleteFolderRecursive(tempPath)

	if (!languageImport) {
		// eslint-disable-next-line no-console
		console.error(`[LANGAUGE] ERROR: could not read default export from language file '${locale}'`)
		return null
	}

	return languageImport
}

const parseAndGenerate = async (config: GeneratorConfigWithDefaultValues) => {
	const { baseLocale, locales: localesToUse, tempPath, outputPath } = config

	const locales = (await getAllLanguages(outputPath)).filter((locale) => localesToUse.includes(locale))
	const locale = locales.find((l) => l === baseLocale) || locales[0]

	// TODO: display warning if no locale is defined or one of the `localesToUse` is missing

	const languageFile = (locale && (await parseLanguageFile(outputPath, locale, tempPath))) || {}

	await generate(languageFile, { ...config, baseLocale, locales })
}

const DEBOUNCE_TIME = 100
let debounceIndex = 0

const debonce = (callback: () => void) =>
	setTimeout(
		(i) => {
			if (i === debounceIndex) {
				callback()
			}
		},
		DEBOUNCE_TIME,
		++debounceIndex,
	)

export const startWatcher = async (config: GeneratorConfig): Promise<void> => {
	const configWithDefaultValues = setDefaultConfigValuesIfMissing(config)
	const { outputPath } = configWithDefaultValues

	const onChange = parseAndGenerate.bind(null, configWithDefaultValues)

	await createPathIfNotExits(outputPath)

	fs.watch(outputPath, { recursive: true }, () => debonce(onChange))

	// eslint-disable-next-line no-console
	console.info(`[LANGAUGE] watcher started in: '${outputPath}'`)

	onChange()
}
