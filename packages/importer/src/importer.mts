import { getConfigWithDefaultValues } from '@typesafe-i18n/config/config.mjs'
import { generateLocaleTemplate } from '@typesafe-i18n/generator/files/generate-template-locale.mjs'
import { generateNamespaceTemplate } from '@typesafe-i18n/generator/files/generate-template-namespace.mjs'
import { generate } from '@typesafe-i18n/generator/generate-files.mjs'
import { configureOutputHandler } from '@typesafe-i18n/generator/output-handler.mjs'
import { getAllLocales, parseLanguageFile } from '@typesafe-i18n/generator/parse-language-file.mjs'
import { parseTypescriptVersion } from '@typesafe-i18n/generator/utils/generator.utils.mjs'
import { createLogger } from '@typesafe-i18n/generator/utils/logger.mjs'
import type { BaseTranslation, ImportLocaleMapping, Locale } from '@typesafe-i18n/runtime/core.mjs'
import ts from 'typescript'

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

	const locales = await getAllLocales(config.outputPath)

	logger.info(`updating types ...`)
	await generate(baseTranslation, config, version, undefined, undefined, locales, baseNamespaces)
	logger.info(`updating types completed`)

	return createdLocales
}
