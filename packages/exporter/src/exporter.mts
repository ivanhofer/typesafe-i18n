import { getConfigWithDefaultValues } from '@typesafe-i18n/config/config.mjs'
import type { GeneratorConfigWithDefaultValues, OutputFormats } from '@typesafe-i18n/config/types.mjs'
import { configureOutputHandler } from '@typesafe-i18n/generator/output-handler.mjs'
import { getAllLocales, parseLanguageFile } from '@typesafe-i18n/generator/parse-language-file.mjs'
import { parseTypescriptVersion } from '@typesafe-i18n/generator/utils/generator.utils.mjs'
import { createLogger } from '@typesafe-i18n/generator/utils/logger.mjs'
import { findAllNamespacesForLocale } from '@typesafe-i18n/generator/utils/namespaces.utils.mjs'
import type { BaseTranslation, ExportLocaleMapping, Locale } from '@typesafe-i18n/runtime/core.mjs'
import { resolve } from 'path'
import ts from 'typescript'

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
