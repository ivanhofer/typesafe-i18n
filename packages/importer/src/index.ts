import { generateBaseLocaleTemplate } from 'packages/generator/src/files/generate-template-baseLocale'
import { getConfigWithDefaultValues } from 'packages/generator/src/generate-files'
import { parseTypescriptVersion } from 'packages/generator/src/generator-util'
import { configureOutputHandler } from 'packages/generator/src/output-handler'
import * as ts from 'typescript'
import { BaseTranslation, Locale } from '../../core/src/core'

interface LocaleMapping {
	locale: string
	translations: BaseTranslation
}

export const storeLocaleToDisk = async (localeMapping: LocaleMapping): Promise<Locale | undefined> =>
	(await storeLocalesToDisk([localeMapping]))[0]

export const storeLocalesToDisk = async (localeMappings: LocaleMapping[]): Promise<Locale[]> => {
	const config = await getConfigWithDefaultValues()

	const version = parseTypescriptVersion(ts.versionMajorMinor)
	configureOutputHandler(config, version)

	const createdLocales: Locale[] = []
	for (const { locale, translations } of localeMappings) {
		const isBaseLocale = locale === config.baseLocale

		if (isBaseLocale) {
			await generateBaseLocaleTemplate(config, true, false, translations)
		}

		// TODO: generateLocale for other locales
	}

	return createdLocales
}
