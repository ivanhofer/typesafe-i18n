import type { BaseTranslation } from '../core/core'
import { generateTypes } from './files/generate-types'
import { generateUtil } from './files/generate-util'
import { generateSvelteAdapter } from './files/generate-adapter-svelte'
import { generateFormattersTemplate } from './files/generate-template-formatters'
import { generateCustomTypesTemplate } from './files/generate-template-types'
import { generateBaseLocaleTemplate } from './files/generate-template-baseLocale'
import { logger as defaultLogger, Logger, supportsImportType, TypescriptVersion } from './generator-util'
import { generateNodeAdapter } from './files/generate-adapter-node'
import { generateReactAdapter } from './files/generate-adapter-react'
import { importFile } from './file-utils'
import path from 'path'

// --------------------------------------------------------------------------------------------------------------------
// types --------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------

type Adapters = 'node' | 'svelte' | 'react'

export type GeneratorConfig = {
	baseLocale?: string
	locales?: string[]

	tempPath?: string
	outputPath?: string
	typesFileName?: string
	utilFileName?: string
	formattersTemplateFileName?: string
	typesTemplateFileName?: string

	adapter?: Adapters
	adapterFileName?: string
	loadLocalesAsync?: boolean
	generateOnlyTypes?: boolean
}

export type GeneratorConfigWithDefaultValues = GeneratorConfig & {
	baseLocale: string
	locales: string[]
	tempPath: string
	outputPath: string
	typesFileName: string
	utilFileName: string
	formattersTemplateFileName: string
	typesTemplateFileName: string
	loadLocalesAsync: boolean
	generateOnlyTypes: boolean
}

// --------------------------------------------------------------------------------------------------------------------
// implementation -----------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------

export const readConfig = async (config: GeneratorConfig | undefined): Promise<GeneratorConfig> => {
	const generatorConfig =
		config || (await importFile<GeneratorConfig>(path.resolve('.typesafe-i18n.json'), false)) || {}

	// remove "$schema" property
	return Object.fromEntries(Object.entries(generatorConfig).filter(([key]) => key !== '$schema'))
}

export const getConfigWithDefaultValues = async (
	config: GeneratorConfig | undefined,
): Promise<GeneratorConfigWithDefaultValues> => ({
	baseLocale: 'en',
	locales: [],
	tempPath: './node_modules/typesafe-i18n/temp-output/',
	outputPath: './src/i18n/',
	typesFileName: 'i18n-types',
	utilFileName: 'i18n-util',
	formattersTemplateFileName: 'formatters',
	typesTemplateFileName: 'custom-types',
	loadLocalesAsync: true,
	generateOnlyTypes: false,
	...(await readConfig(config)),
})

export const generate = async (
	translations: BaseTranslation,
	config: GeneratorConfigWithDefaultValues = {} as GeneratorConfigWithDefaultValues,
	version: TypescriptVersion,
	logger: Logger = defaultLogger,
	forceOverride = false,
): Promise<void> => {
	const importType = `import${supportsImportType(version) ? ' type' : ''}`

	await generateBaseLocaleTemplate(config, importType, forceOverride)

	const hasCustomTypes = await generateTypes({ ...config, translations }, importType, version, logger)

	if (!config.generateOnlyTypes) {
		await generateFormattersTemplate(config, importType, forceOverride)

		if (hasCustomTypes) {
			await generateCustomTypesTemplate(config, forceOverride)
		}

		await generateUtil(config, importType)
	}

	switch (config.adapter) {
		case 'node':
			await generateNodeAdapter(config)
			break
		case 'svelte':
			await generateSvelteAdapter(config, importType)
			break
		case 'react':
			await generateReactAdapter(config, importType)
			break
	}
}
