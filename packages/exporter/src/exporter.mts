import fs from 'fs/promises'
import { resolve } from 'path'
import ts from 'typescript'
import { getConfigWithDefaultValues } from '../../config/src/config.mjs'
import type { GeneratorConfigWithDefaultValues, OutputFormats } from '../../config/src/types.mjs'
import { configureOutputHandler } from '../../generator/src/output-handler.mjs'
import { parseLanguageFile } from '../../generator/src/parse-language-file.mjs'
import { parseTypescriptVersion } from '../../generator/src/utils/generator.utils.mjs'
import { createLogger } from '../../generator/src/utils/logger.mjs'
import { findAllNamespacesForLocale } from '../../generator/src/utils/namespaces.utils.mjs'
import type { BaseTranslation, ExportLocaleMapping, Locale } from '../../runtime/src/core.mjs'
import { getAllLocales } from '../../shared/src/file.utils.mjs'

const logger = createLogger(console, true)

// --------------------------------------------------------------------------------------------------------------------

const setup = async (): Promise<GeneratorConfigWithDefaultValues> => {
	const config = await getConfigWithDefaultValues()

	const version = parseTypescriptVersion(ts.versionMajorMinor)
	configureOutputHandler(config, version)

	return config
}

const readTranslation = async (
	locale: Locale,
	outputPath: string,
	outputFormat: OutputFormats,
	tempPath: string,
	typesFileName: string,
): Promise<ExportLocaleMapping> => {
	logger.info(`exporting translations for locale '${locale}' ...`)

	const translations = await parseLanguageFile(
		outputPath,
		outputFormat,
		typesFileName,
		resolve(tempPath, locale),
		locale,
	)
	if (!translations) {
		logger.error(`could not find locale file '${locale}'`)
		return { locale, translations: {}, namespaces: [] }
	}

	const namespaces = findAllNamespacesForLocale(locale, outputPath)
	for (const namespace of namespaces) {
		logger.info(`adding namespace '${locale}/${namespace}' ...`)
		;(translations as Record<string, BaseTranslation>)[namespace] =
			(await parseLanguageFile(
				outputPath,
				outputFormat,
				typesFileName,
				resolve(tempPath, locale, namespace),
				locale,
				namespace,
			)) || {}
	}

	logger.info(`exporting translations for locale '${locale}' completed`)

	return { locale, translations: translations as BaseTranslation, namespaces }
}

// --------------------------------------------------------------------------------------------------------------------

export const readTranslationFromDisk = async (locale: Locale): Promise<ExportLocaleMapping> => {
	const config = await setup()
	const { outputPath, outputFormat, tempPath, typesFileName } = config

	return await readTranslation(locale, outputPath, outputFormat, tempPath, typesFileName)
}

// --------------------------------------------------------------------------------------------------------------------

export const readTranslationsFromDisk = async (): Promise<ExportLocaleMapping[]> => {
	const config = await setup()
	const { outputPath, outputFormat, tempPath, typesFileName } = config

	const locales = await getAllLocales(fs, outputPath, outputFormat)

	const promises: Promise<ExportLocaleMapping>[] = locales.map((locale) =>
		readTranslation(locale, outputPath, outputFormat, tempPath, typesFileName),
	)

	return Promise.all(promises)
}
