import type { GeneratorConfigWithDefaultValues } from '../../config/src/types'
import type { BaseTranslation, Locale } from '../../runtime/src/core'
import { generateAngularAdapter } from './files/generate-adapter-angular'
import { generateNodeAdapter } from './files/generate-adapter-node'
import { generateReactAdapter } from './files/generate-adapter-react'
import { generateSvelteAdapter } from './files/generate-adapter-svelte'
import { generateVueAdapter } from './files/generate-adapter-vue'
import { generateFormattersTemplate } from './files/generate-template-formatters'
import { generateBaseLocaleTemplate, generateLocaleTemplate } from './files/generate-template-locale'
import { generateCustomTypesTemplate } from './files/generate-template-types'
import { generateTypes } from './files/generate-types'
import { generateUtil } from './files/generate-util'
import { generateAsyncUtil } from './files/generate-util-async'
import { generateSyncUtil } from './files/generate-util-sync'
import { logger as defaultLogger, Logger, TypescriptVersion } from './generator-util'
import { configureOutputHandler } from './output-handler'

const generateDictionaryFiles = async (
	config: GeneratorConfigWithDefaultValues = {} as GeneratorConfigWithDefaultValues,
	forceOverride: boolean,
) => {
	if (!forceOverride) {
		return
	}

	const dummyTranslations = {
		en: 'Hi {name}! Please leave a star if you like this project: https://github.com/ivanhofer/typesafe-i18n',
		de: 'Hallo {name}! Bitte hinterlasse einen Stern, wenn dir das Projekt gefällt: https://github.com/ivanhofer/typesafe-i18n',
	}

	const primaryLocale = config.baseLocale.startsWith('de') ? 'de' : 'en'
	const secondaryLocale = primaryLocale === 'de' ? 'en' : 'de'

	await generateBaseLocaleTemplate(
		config,
		{
			HI: dummyTranslations[primaryLocale].replace('{name}', '{name:string}'),
		},
		'TODO: your translations go here',
	)

	await generateLocaleTemplate(
		config,
		secondaryLocale,
		{
			HI: dummyTranslations[secondaryLocale],
		},
		'this is an example Translation, just rename or delete this folder if you want',
	)
}

export const generate = async (
	translations: BaseTranslation | BaseTranslation[],
	config: GeneratorConfigWithDefaultValues = {} as GeneratorConfigWithDefaultValues,
	version: TypescriptVersion,
	logger: Logger = defaultLogger,
	forceOverride = false,
	locales: Locale[] = [],
): Promise<void> => {
	configureOutputHandler(config, version)

	// TODO: process generation in parallel

	await generateDictionaryFiles(config, forceOverride)

	const hasCustomTypes = await generateTypes({ ...config, translations, locales }, logger)

	if (hasCustomTypes) {
		await generateCustomTypesTemplate(config, forceOverride)
	}

	if (config.generateOnlyTypes) return

	await generateFormattersTemplate(config, forceOverride)

	await generateUtil(config, locales)
	await generateSyncUtil(config, locales)
	await generateAsyncUtil(config, locales)

	switch (config.adapter) {
		case 'angular':
			await generateAngularAdapter(config)
			break
		case 'node':
			await generateNodeAdapter(config)
			break
		case 'react':
			await generateReactAdapter(config)
			break
		case 'svelte':
			await generateSvelteAdapter(config)
			break
		case 'vue':
			await generateVueAdapter(config)
			break
	}
}
