import fs from 'fs'
import path, { resolve } from 'path'
import { DEFAULT_LOCALE } from '../constants'
import { LangaugeBaseTranslation } from '../types'
import { copyFile, createPathIfNotExits, deleteFile, getFiles, importFile } from './file-utils'
import { generateTypes } from './generator'

type Config = {
	outputFile?: string
	outputPath?: string
	baseLocale?: string
}

const BASE_PATH = './src/langauge'
const DEBOUNCE_TIME = 100

const getAllLanguages = async (path: string) => {
	const files = await getFiles(path, 1)
	return files.filter(({ folder, name }) => folder && name === 'index.ts').map(({ folder }) => folder)
}

const aa = async (outputPath: string, locale: string): Promise<LangaugeBaseTranslation | null> => {
	const original = resolve(outputPath, locale, 'index.ts')
	const copy = resolve(outputPath, `langauge-temp-${debounceIndex}.ts`)

	const copySuccess = await copyFile(original, copy)
	if (!copySuccess) {
		// eslint-disable-next-line no-console
		console.error(`[LANGAUGE] ERROR: something went wrong`)
		return null
	}

	const languageImport = await importFile<LangaugeBaseTranslation>(copy)
	await deleteFile(copy)

	if (!languageImport) {
		// eslint-disable-next-line no-console
		console.error(`[LANGAUGE] ERROR: could not read default export from language file '${locale}'`)
		return null
	}

	return languageImport
}

const generate = async (outputPath: string, outputFile: string | undefined, baseLanguage: string) => {
	const locales = await getAllLanguages(outputPath)
	const locale = locales.find((l) => l === baseLanguage) || locales[0]

	const languageFile = (locale && (await aa(outputPath, locale))) || {}

	await generateTypes(languageFile, {
		outputPath: outputPath,
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

const startWatcher = async (config: Config) => {
	const { outputPath = BASE_PATH, outputFile, baseLocale = DEFAULT_LOCALE } = config

	const onChange = generate.bind(null, outputPath, outputFile, baseLocale)

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

const autowatch = async () => {
	const config = (await importFile<Config>(path.resolve('.langauge.json'))) || {}

	startWatcher(config)
}

autowatch()
