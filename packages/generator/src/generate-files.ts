import path from 'path'
import type { BaseTranslation } from '../../core/src/core'
import { version } from '../../version'
import { Config, GeneratorConfig, GeneratorConfigWithDefaultValues } from './config-types'
import { doesPathExist, importFile, writeConfigFile } from './file-utils'
import { generateAngularAdapter } from './files/generate-adapter-angular'
import { generateNodeAdapter } from './files/generate-adapter-node'
import { generateReactAdapter } from './files/generate-adapter-react'
import { generateSvelteAdapter } from './files/generate-adapter-svelte'
import { generateFormattersTemplate } from './files/generate-template-formatters'
import { generateBaseLocaleTemplate, generateLocaleTemplate } from './files/generate-template-locale'
import { generateCustomTypesTemplate } from './files/generate-template-types'
import { generateTypes } from './files/generate-types'
import { generateUtil } from './files/generate-util'
import { logger as defaultLogger, Logger, TypescriptVersion } from './generator-util'
import { configureOutputHandler } from './output-handler'

// --------------------------------------------------------------------------------------------------------------------
// implementation -----------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------

export const writeConfigToFile = async (config: GeneratorConfig) =>
	writeConfigFile({ $schema: `https://unpkg.com/typesafe-i18n@${version}/schema/typesafe-i18n.json`, ...config })

export const doesConfigFileExist = async () => doesPathExist(path.resolve('.typesafe-i18n.json'))

export const readConfig = async (config?: GeneratorConfig | undefined): Promise<Config> => {
	const generatorConfig = {
		...config,
		...((await importFile<GeneratorConfig>(path.resolve('.typesafe-i18n.json'), false)) || {}),
	}

	// remove "$schema" property
	return Object.fromEntries(Object.entries(generatorConfig).filter(([key]) => key !== '$schema'))
}

export const getConfigWithDefaultValues = async (
	config?: Config | undefined,
	shouldReadConfig = true,
): Promise<GeneratorConfigWithDefaultValues> => ({
	baseLocale: 'en',
	locales: [],

	tempPath: './node_modules/typesafe-i18n/temp-output/',
	outputPath: './src/i18n/',
	outputFormat: 'TypeScript',
	typesFileName: 'i18n-types',
	utilFileName: 'i18n-util',
	formattersTemplateFileName: 'formatters',
	typesTemplateFileName: 'custom-types',
	esmImports: false,

	loadLocalesAsync: true,
	generateOnlyTypes: false,
	banner: '/* eslint-disable */',
	...(shouldReadConfig ? await readConfig(config) : {}),
})

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
): Promise<void> => {
	configureOutputHandler(config, version)

	await generateDictionaryFiles(config, forceOverride)

	const hasCustomTypes = await generateTypes({ ...config, translations }, logger)

	if (!config.generateOnlyTypes) {
		await generateFormattersTemplate(config, forceOverride)

		if (hasCustomTypes) {
			await generateCustomTypesTemplate(config, forceOverride)
		}

		await generateUtil(config)
	}

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
	}
}
