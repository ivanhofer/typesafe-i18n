import path from 'path'
import type { BaseTranslation } from '../../core/src/core'
import { importFile } from './file-utils'
import { generateAngularAdapter } from './files/generate-adapter-angular'
import { generateNodeAdapter } from './files/generate-adapter-node'
import { generateReactAdapter } from './files/generate-adapter-react'
import { generateSvelteAdapter } from './files/generate-adapter-svelte'
import { generateBaseLocaleTemplate } from './files/generate-template-baseLocale'
import { generateFormattersTemplate } from './files/generate-template-formatters'
import { generateCustomTypesTemplate } from './files/generate-template-types'
import { generateTypes } from './files/generate-types'
import { generateUtil } from './files/generate-util'
import { logger as defaultLogger, Logger, TypescriptVersion } from './generator-util'
import { configureOutputHandler } from './output-handler'

// --------------------------------------------------------------------------------------------------------------------
// types --------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------

type Adapters = 'angular' | 'node' | 'react' | 'svelte'

export type OutputFormats = 'TypeScript' | 'JavaScript'

export type GeneratorConfig = {
	baseLocale?: string

	tempPath?: string
	outputPath?: string
	outputFormat?: OutputFormats
	typesFileName?: string
	utilFileName?: string
	formattersTemplateFileName?: string
	typesTemplateFileName?: string
	esmImports?: boolean

	adapter?: Adapters
	adapterFileName?: string
	loadLocalesAsync?: boolean
	generateOnlyTypes?: boolean

	banner?: string
}

export type RollupConfig = {
	locales?: string[]
}

export type Config = GeneratorConfig & RollupConfig

export type GeneratorConfigWithDefaultValues = GeneratorConfig & {
	baseLocale: string
	locales: string[]

	tempPath: string
	outputPath: string
	outputFormat: OutputFormats
	typesFileName: string
	utilFileName: string
	formattersTemplateFileName: string
	typesTemplateFileName: string
	esmImports: boolean

	loadLocalesAsync: boolean
	generateOnlyTypes: boolean
	banner: string
}

// --------------------------------------------------------------------------------------------------------------------
// implementation -----------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------

export const readConfig = async (config: GeneratorConfig | undefined): Promise<Config> => {
	const generatorConfig = {
		...config,
		...((await importFile<GeneratorConfig>(path.resolve('.typesafe-i18n.json'), false)) || {}),
	}

	// remove "$schema" property
	return Object.fromEntries(Object.entries(generatorConfig).filter(([key]) => key !== '$schema'))
}

export const getConfigWithDefaultValues = async (
	config: Config | undefined,
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
	...(await readConfig(config)),
})

export const generate = async (
	translations: BaseTranslation,
	config: GeneratorConfigWithDefaultValues = {} as GeneratorConfigWithDefaultValues,
	version: TypescriptVersion,
	logger: Logger = defaultLogger,
	forceOverride = false,
): Promise<void> => {
	configureOutputHandler(config, version)

	await generateBaseLocaleTemplate(config, forceOverride)

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
