import type { BaseTranslation, ExportLocaleMapping, Locale } from '@typesafe-i18n/runtime/core.mjs'
import { resolve } from 'path'
import ts from 'typescript'
import { getConfigWithDefaultValues } from '../../config/src/config'
import type { GeneratorConfigWithDefaultValues, OutputFormats } from '../../config/src/types.mjs'
import { configureOutputHandler } from '../../generator/src/output-handler.mjs'
import { getAllLocales, parseLanguageFile } from '../../generator/src/parse-language-file'
import { parseTypescriptVersion } from '../../generator/src/utils/generator.utils.mjs'
import { createLogger } from '../../generator/src/utils/logger.mjs'
import { findAllNamespacesForLocale } from '../../generator/src/utils/namespaces.utils'

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

	const locales = await getAllLocales(outputPath)

	const promises: Promise<ExportLocaleMapping>[] = locales.map((locale) =>
		readTranslation(locale, outputPath, outputFormat, tempPath, typesFileName),
	)

	return Promise.all(promises)
}
