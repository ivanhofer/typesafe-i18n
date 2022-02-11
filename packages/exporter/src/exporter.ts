import { resolve } from 'path'
import ts from 'typescript'
import { getConfigWithDefaultValues } from '../../config/src/config'
import type { GeneratorConfigWithDefaultValues } from '../../config/src/types'
import { findAllNamespacesForLocale } from '../../generator/src/generate-dictionary'
import { createLogger, parseTypescriptVersion } from '../../generator/src/generator-util'
import { configureOutputHandler } from '../../generator/src/output-handler'
import { getAllLanguages, parseLanguageFile } from '../../generator/src/parse-language-file'
import type { BaseTranslation, ExportLocaleMapping, Locale } from '../../runtime/src/core'

const logger = createLogger(console, true)

// --------------------------------------------------------------------------------------------------------------------

const setup = async (): Promise<GeneratorConfigWithDefaultValues> => {
	const config = await getConfigWithDefaultValues()

	const version = parseTypescriptVersion(ts.versionMajorMinor)
	configureOutputHandler(config, version)

	return config
}

const readTranslation = async (locale: Locale, outputPath: string, tempPath: string): Promise<ExportLocaleMapping> => {
	logger.info(`exporting translations for locale '${locale}' ...`)

	const translations = await parseLanguageFile(outputPath, resolve(tempPath, locale), locale)
	if (!translations) {
		logger.error(`could not find locale file '${locale}'`)
		return { locale, translations: {}, namespaces: [] }
	}

	const namespaces = findAllNamespacesForLocale(locale, outputPath)
	for (const namespace of namespaces) {
		logger.info(`adding namespace '${locale}/${namespace}' ...`)
		;(translations as Record<string, BaseTranslation>)[namespace] =
			(await parseLanguageFile(outputPath, resolve(tempPath, locale, namespace), locale, namespace)) || {}
	}

	logger.info(`exporting translations for locale '${locale}' completed`)

	return { locale, translations: translations as BaseTranslation, namespaces }
}

// --------------------------------------------------------------------------------------------------------------------

export const readTranslationFromDisk = async (locale: Locale): Promise<ExportLocaleMapping> => {
	const config = await setup()
	const { outputPath, tempPath } = config

	return await readTranslation(locale, outputPath, tempPath)
}

// --------------------------------------------------------------------------------------------------------------------

export const readTranslationsFromDisk = async (): Promise<ExportLocaleMapping[]> => {
	const config = await setup()
	const { outputPath, tempPath } = config

	const locales = await getAllLanguages(outputPath)

	const promises: Promise<ExportLocaleMapping>[] = locales.map((locale) =>
		readTranslation(locale, outputPath, tempPath),
	)

	return Promise.all(promises)
}
