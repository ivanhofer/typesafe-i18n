import type { GeneratorConfigWithDefaultValues } from '../../config/src/types'
import type { BaseTranslation, Locale } from '../../runtime/src/core'
import { generateAngularAdapter } from './files/generate-adapter-angular'
import { generateNodeAdapter } from './files/generate-adapter-node'
import { generateReactAdapter } from './files/generate-adapter-react'
import { generateSvelteAdapter } from './files/generate-adapter-svelte'
import { generateVueAdapter } from './files/generate-adapter-vue'
import { generateFormattersTemplate } from './files/generate-template-formatters'
import { generateLocaleTemplate } from './files/generate-template-locale'
import { generateNamespaceTemplate } from './files/generate-template-namespace'
import { generateCustomTypesTemplate } from './files/generate-template-types'
import { generateTypes } from './files/generate-types'
import { generateUtil } from './files/generate-util'
import { generateAsyncUtil } from './files/generate-util-async'
import { generateSyncUtil } from './files/generate-util-sync'
import { configureOutputHandler } from './output-handler'
import type { TypescriptVersion } from './utils/generator.utils'
import { logger as defaultLogger, Logger } from './utils/logger'
import { findAllNamespacesForLocale } from './utils/namespaces.utils'

export const generateNamespaceFiles = async (
	config: GeneratorConfigWithDefaultValues,
	locales: Locale[] = [],
	namespaces: string[] = [],
	forceOverride: boolean,
): Promise<void> => {
	const localesToCheck = locales.filter((locale) => locale !== config.baseLocale)

	const promises: Promise<unknown>[] = []
	localesToCheck.forEach((locale) => {
		const foundNamespaces = findAllNamespacesForLocale(locale, config.outputPath)
		const missingNamespaces = namespaces.filter((namespace) => forceOverride || !foundNamespaces.includes(namespace))

		missingNamespaces.forEach((missingNamespace) =>
			promises.push(
				generateNamespaceTemplate(config, locale, missingNamespace, undefined, 'TODO: insert translations'),
			),
		)
	})

	await Promise.all(promises)
}

const generateDictionaryFiles = async (
	config: GeneratorConfigWithDefaultValues = {} as GeneratorConfigWithDefaultValues,
	forceOverride: boolean,
) => {
	if (!forceOverride) return

	const dummyTranslations = {
		en: 'Hi {name}! Please leave a star if you like this project: https://github.com/ivanhofer/typesafe-i18n',
		de: 'Hallo {name}! Bitte hinterlasse einen Stern, wenn dir das Projekt gefällt: https://github.com/ivanhofer/typesafe-i18n',
	}

	const primaryLocale = config.baseLocale.startsWith('de') ? 'de' : 'en'
	const secondaryLocale = primaryLocale === 'de' ? 'en' : 'de'

	const promises: Promise<unknown>[] = []

	promises.push(
		generateLocaleTemplate(
			config,
			config.baseLocale,
			{
				HI: dummyTranslations[primaryLocale].replace('{name}', '{name:string}'),
			},
			'TODO: your translations go here',
		),
	)

	promises.push(
		generateLocaleTemplate(
			config,
			secondaryLocale,
			{
				HI: dummyTranslations[secondaryLocale],
			},
			'this is an example Translation, just rename or delete this folder if you want',
		),
	)

	await Promise.all(promises)
}

export const generate = async (
	translations: BaseTranslation | BaseTranslation[],
	config: GeneratorConfigWithDefaultValues = {} as GeneratorConfigWithDefaultValues,
	version: TypescriptVersion,
	logger: Logger = defaultLogger,
	forceOverride = false,
	locales: Locale[] = [],
	namespaces: string[] = [],
): Promise<void> => {
	configureOutputHandler(config, version)

	const hasCustomTypes = await generateTypes({ ...config, translations, locales, namespaces }, logger)

	const promises: Promise<unknown>[] = []

	if (hasCustomTypes) {
		promises.push(generateCustomTypesTemplate(config, forceOverride))
	}

	promises.push(generateDictionaryFiles(config, forceOverride))
	promises.push(generateNamespaceFiles(config, locales, namespaces, forceOverride))

	if (config.generateOnlyTypes) return

	promises.push(generateFormattersTemplate(config, forceOverride))

	promises.push(generateUtil(config, locales, namespaces))
	promises.push(generateSyncUtil(config, locales, namespaces))
	promises.push(generateAsyncUtil(config, locales, namespaces))

	switch (config.adapter) {
		case 'angular':
			promises.push(generateAngularAdapter(config))
			break
		case 'node':
			promises.push(generateNodeAdapter(config))
			break
		case 'react':
			promises.push(generateReactAdapter(config))
			break
		case 'svelte':
			promises.push(generateSvelteAdapter(config))
			break
		case 'vue':
			promises.push(generateVueAdapter(config))
			break
	}

	await Promise.all(promises)
}
