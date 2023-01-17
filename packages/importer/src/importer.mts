import fs from 'fs/promises'
import ts from 'typescript'
import { getConfigWithDefaultValues } from '../../config/src/config.mjs'
import { generateLocaleTemplate } from '../../generator/src/files/generate-template-locale.mjs'
import { generateNamespaceTemplate } from '../../generator/src/files/generate-template-namespace.mjs'
import { generate } from '../../generator/src/generate-files.mjs'
import { configureOutputHandler } from '../../generator/src/output-handler.mjs'
import { parseLanguageFile } from '../../generator/src/parse-language-file.mjs'
import { parseTypescriptVersion } from '../../generator/src/utils/generator.utils.mjs'
import { createLogger } from '../../generator/src/utils/logger.mjs'
import type { BaseTranslation, ImportLocaleMapping, Locale } from '../../runtime/src/core.mjs'
import { getAllLocales } from '../../shared/src/file.utils.mjs'

const logger = createLogger(console, true)

// --------------------------------------------------------------------------------------------------------------------

export const storeTranslationToDisk = async (
	localeMapping: ImportLocaleMapping,
	generateTypes = true,
): Promise<Locale | undefined> => (await storeTranslationsToDisk([localeMapping], generateTypes))[0]

// --------------------------------------------------------------------------------------------------------------------

export const storeTranslationsToDisk = async (
	localeMappings: ImportLocaleMapping[],
	generateTypes = true,
): Promise<Locale[]> => {
	const config = await getConfigWithDefaultValues()

	const version = parseTypescriptVersion(ts.versionMajorMinor)
	configureOutputHandler(config, version)

	const createdLocales: Locale[] = []
	let baseTranslation: BaseTranslation | BaseTranslation[] | undefined = undefined

	let baseNamespaces: string[] = []
	for (const { locale, translations, namespaces } of localeMappings) {
		if (!locale) continue

		const isBaseLocale = locale === config.baseLocale

		if (isBaseLocale) {
			baseTranslation = translations
			baseNamespaces = namespaces || []
		}

		logger.info(`importing translations for locale '${locale}' ...`)
		let error = undefined

		const translationsWithoutNamespaces = Object.fromEntries(
			Object.entries(translations).filter(([key]) => !baseNamespaces.includes(key)),
		)
		await generateLocaleTemplate(config, locale, translationsWithoutNamespaces, undefined, true).catch(
			(e) => (error = e),
		)

		if (error) {
			logger.error(`importing translations for locale '${locale}' failed:`, error)
			continue
		}

		for (const namespace of baseNamespaces) {
			logger.info(`creating namespace '${locale}/${namespace}' ...`)

			await generateNamespaceTemplate(
				config,
				locale,
				namespace,
				(translations as Record<string, BaseTranslation>)[namespace],
				undefined,
				true,
			)
		}

		logger.info(`importing translations for locale '${locale}' completed`)

		createdLocales.push(locale)
	}

	if (!createdLocales.length) {
		logger.warn(`nothing to import`)
		return []
	}

	if (!generateTypes) {
		return createdLocales
	}

	if (!baseTranslation) {
		baseTranslation =
			(await parseLanguageFile(
				config.outputPath,
				config.outputFormat,
				config.typesFileName,
				config.tempPath,
				config.baseLocale,
			)) || undefined
		if (!baseTranslation) {
			logger.error(`could not read base locale file '${config.baseLocale}'`)
			return []
		}
	}

	const locales = await getAllLocales(fs, config.outputPath, config.outputFormat)

	logger.info(`updating types ...`)
	await generate(baseTranslation, config, version, undefined, undefined, locales, baseNamespaces)
	logger.info(`updating types completed`)

	return createdLocales
}
