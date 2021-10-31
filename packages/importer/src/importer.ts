import ts from 'typescript'
import { BaseTranslation, Locale, LocaleMapping } from '../../core/src/core'
import { generateLocaleTemplate } from '../../generator/src/files/generate-template-locale'
import { generate, getConfigWithDefaultValues } from '../../generator/src/generate-files'
import { createLogger, parseTypescriptVersion } from '../../generator/src/generator-util'
import { configureOutputHandler } from '../../generator/src/output-handler'
import { parseLanguageFile } from '../../generator/src/parse-language-file'

const logger = createLogger(console, true)

// --------------------------------------------------------------------------------------------------------------------

export const storeTranslationToDisk = async (
	localeMapping: LocaleMapping,
	generateTypes = true,
): Promise<Locale | undefined> => (await storeTranslationsToDisk([localeMapping], generateTypes))[0]

// --------------------------------------------------------------------------------------------------------------------

export const storeTranslationsToDisk = async (
	localeMappings: LocaleMapping[],
	generateTypes = true,
): Promise<Locale[]> => {
	const config = await getConfigWithDefaultValues()

	const version = parseTypescriptVersion(ts.versionMajorMinor)
	configureOutputHandler(config, version)

	const createdLocales: Locale[] = []
	let baseTranslation: BaseTranslation | undefined = undefined

	for (const { locale, translations } of localeMappings) {
		if (!locale) continue

		const isBaseLocale = locale === config.baseLocale

		if (isBaseLocale) {
			baseTranslation = translations
		}

		logger.info(`importing translations for locale '${locale}' ...`)
		let error = undefined

		await generateLocaleTemplate(config, locale, translations, undefined, true).catch((e) => (error = e))

		if (error) {
			logger.error(`importing translations for locale '${locale}' failed:`, error)
			continue
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
		baseTranslation = (await parseLanguageFile(config.outputPath, config.baseLocale, config.tempPath)) || undefined
		if (!baseTranslation) {
			logger.error(`could not read base locale file '${config.baseLocale}'`)
			return []
		}
	}

	logger.info(`updating types ...`)
	await generate(baseTranslation, config, version)
	logger.info(`updating types completed`)

	return createdLocales
}
