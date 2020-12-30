import fs from 'fs'
import { resolve } from 'path'
import { DEFAULT_LOCALE } from '../constants/constants'
import { LangaugeBaseTranslation } from '../types/types'
import { copyFile, createPathIfNotExits, deleteFolderRecursive, getFiles, importFile } from './file-utils'
import { generateTypes } from './generator'
import * as typescript from 'typescript'
const { createProgram } = typescript

export type WatcherConfig = {
	outputFile?: string
	outputPath?: string
	baseLocale?: string
	tempPath?: string
}

const BASE_PATH = './src/langauge'
const TEMP_PATH = './node_modules/langauge/temp-output'
const DEBOUNCE_TIME = 100

const getAllLanguages = async (path: string) => {
	const files = await getFiles(path, 1)
	return files.filter(({ folder, name }) => folder && name === 'index.ts').map(({ folder }) => folder)
}

const transpileTypescriptAndPrepareImportFile = async (
	languageFilePath: string,
	tempPath: string,
	locale: string,
): Promise<string> => {
	const program = createProgram([languageFilePath], { outDir: tempPath })
	program.emit()

	const compiledPath = resolve(tempPath, locale, 'index.js')
	const copyPath = resolve(tempPath, locale, `langauge-temp-${debounceIndex}.js`)

	const copySuccess = await copyFile(compiledPath, copyPath)
	if (!copySuccess) {
		// eslint-disable-next-line no-console
		console.error(`[LANGAUGE] ERROR: something went wrong`)
		return ''
	}

	return copyPath
}

const getLanguageFile = async (
	outputPath: string,
	locale: string,
	tempPath: string,
): Promise<LangaugeBaseTranslation | null> => {
	const originalPath = resolve(outputPath, locale, 'index.ts')

	await createPathIfNotExits(tempPath)

	const importPath = await transpileTypescriptAndPrepareImportFile(originalPath, tempPath, locale)

	const languageImport = await importFile<LangaugeBaseTranslation>(importPath)

	await deleteFolderRecursive(tempPath)

	if (!languageImport) {
		// eslint-disable-next-line no-console
		console.error(`[LANGAUGE] ERROR: could not read default export from language file '${locale}'`)
		return null
	}

	return languageImport
}

const generate = async (outputPath: string, outputFile: string | undefined, baseLanguage: string, tempPath: string) => {
	const locales = await getAllLanguages(outputPath)
	const locale = locales.find((l) => l === baseLanguage) || locales[0]

	const languageFile = (locale && (await getLanguageFile(outputPath, locale, tempPath))) || {}

	await generateTypes(languageFile, {
		outputPath,
		outputFile,
		baseLocale: locale,
		locales,
	})
}

let debounceIndex = 0
const debonce = (callback: () => void) => {
	setTimeout(
		(i) => {
			if (i === debounceIndex) {
				callback()
			}
		},
		DEBOUNCE_TIME,
		++debounceIndex,
	)
}

export const startWatcher = async (config: WatcherConfig): Promise<void> => {
	const { outputPath = BASE_PATH, outputFile, baseLocale = DEFAULT_LOCALE, tempPath = TEMP_PATH } = config

	const onChange = generate.bind(null, outputPath, outputFile, baseLocale, tempPath)

	await createPathIfNotExits(outputPath)

	fs.watch(outputPath, { recursive: true }, (_event, filename) => {
		if (filename.includes('temp')) {
			return
		}

		debonce(onChange)
	})

	// eslint-disable-next-line no-console
	console.info(`[LANGAUGE] watcher started in: '${outputPath}'`)

	onChange()
}
