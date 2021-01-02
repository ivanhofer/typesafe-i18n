import fs from 'fs'
import { resolve } from 'path'
import { DEFAULT_LOCALE } from '../constants/constants'
import { LangaugeBaseTranslation } from '../types/types'
import { copyFile, createPathIfNotExits, deleteFolderRecursive, getFiles, importFile } from './file-utils'
import { generate } from './generator'
import typescript from 'typescript'
const { createProgram } = typescript

export type WatcherConfig = {
	outputPath?: string
	typesFile?: string
	utilFile?: string
	baseLocale?: string
	tempPath?: string
}

const BASE_PATH = './src/langauge/'
const TEMP_PATH = './node_modules/langauge/temp-output/'
const DEBOUNCE_TIME = 100

const getAllLanguages = async (path: string) => {
	const files = await getFiles(path, 1)
	return files.filter(({ folder, name }) => folder && name === 'index.ts').map(({ folder }) => folder)
}

const transpileTypescriptAndPrepareImportFile = async (languageFilePath: string, tempPath: string): Promise<string> => {
	const program = createProgram([languageFilePath], { outDir: tempPath })
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

const getLanguageFile = async (
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

const parseAndGenerate = async ({
	outputPath,
	typesFile,
	utilFile,
	baseLocale,
	tempPath,
}: {
	outputPath: string
	typesFile: string | undefined
	utilFile: string | undefined
	baseLocale: string
	tempPath: string
}) => {
	const locales = await getAllLanguages(outputPath)
	const locale = locales.find((l) => l === baseLocale) || locales[0]

	const languageFile = (locale && (await getLanguageFile(outputPath, locale, tempPath))) || {}

	await generate(languageFile, {
		outputPath,
		typesFile,
		utilFile,
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
	const { outputPath = BASE_PATH, typesFile, utilFile, baseLocale = DEFAULT_LOCALE, tempPath = TEMP_PATH } = config

	const onChange = parseAndGenerate.bind(null, { outputPath, typesFile, utilFile, baseLocale, tempPath })

	await createPathIfNotExits(outputPath)

	fs.watch(outputPath, { recursive: true }, () => debonce(onChange))

	// eslint-disable-next-line no-console
	console.info(`[LANGAUGE] watcher started in: '${outputPath}'`)

	onChange()
}
