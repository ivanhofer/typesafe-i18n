import { resolve } from 'path'
import ts from 'typescript'
import { BaseTranslation, Locale, LocaleMapping } from '../../core/src/core'
import type { GeneratorConfigWithDefaultValues } from '../../generator/src/config-types'
import { getConfigWithDefaultValues } from '../../generator/src/generate-files'
import { createLogger, parseTypescriptVersion } from '../../generator/src/generator-util'
import { configureOutputHandler } from '../../generator/src/output-handler'
import { getAllLanguages, parseLanguageFile } from '../../generator/src/parse-language-file'

const logger = createLogger(console, true)

// --------------------------------------------------------------------------------------------------------------------

const setup = async (): Promise<GeneratorConfigWithDefaultValues> => {
	const config = await getConfigWithDefaultValues()

	const version = parseTypescriptVersion(ts.versionMajorMinor)
	configureOutputHandler(config, version)

	return config
}

const readTranslation = async (locale: Locale, outputPath: string, tempPath: string): Promise<LocaleMapping> => {
	logger.info(`exporting translations for locale '${locale}' ...`)

	const translations = await parseLanguageFile(outputPath, locale, resolve(tempPath, locale))
	if (!translations) {
		logger.error(`could not find locale file '${locale}'`)
	}

	logger.info(`exporting translations for locale '${locale}' completed`)

	return { locale, translations: translations as BaseTranslation }
}

// --------------------------------------------------------------------------------------------------------------------

export const readTranslationFromDisk = async (locale: Locale): Promise<BaseTranslation | BaseTranslation[]> => {
	const config = await setup()
	const { outputPath, tempPath } = config

	return (await readTranslation(locale, outputPath, tempPath)).translations
}

// --------------------------------------------------------------------------------------------------------------------

export const readTranslationsFromDisk = async (): Promise<LocaleMapping[]> => {
	const config = await setup()
	const { outputPath, tempPath } = config

	const locales = await getAllLanguages(outputPath)

	const promises: Promise<LocaleMapping>[] = locales.map((locale) => readTranslation(locale, outputPath, tempPath))

	return Promise.all(promises)
}
