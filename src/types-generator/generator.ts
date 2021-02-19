import type { BaseTranslation } from '../core/core'
import { generateTypes } from './files/generate-types'
import { generateUtil } from './files/generate-util'
import { generateSvelteAdapter } from './files/generate-adapter-svelte'
import { generateFormattersTemplate } from './files/generate-template-formatters'
import { generateCustomTypesTemplate } from './files/generate-template-types'
import { generateBaseLocaleTemplate } from './files/generate-template-baseLocale'
import { logger as defaultLogger, Logger, supportsImportType, TypescriptVersion } from './generator-util'
import { generateNodeAdapter } from './files/generate-adapter-node'

// --------------------------------------------------------------------------------------------------------------------
// types --------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------

type Adapters = 'svelte' | 'node'

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
	loadLocalesAsync?: boolean
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
}

// --------------------------------------------------------------------------------------------------------------------
// implementation -----------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------

export const setDefaultConfigValuesIfMissing = (config: GeneratorConfig): GeneratorConfigWithDefaultValues => ({
	baseLocale: 'en',
	locales: [],
	tempPath: './node_modules/typesafe-i18n/temp-output/',
	outputPath: './src/i18n/',
	typesFileName: 'i18n-types',
	utilFileName: 'i18n-util',
	formattersTemplateFileName: 'formatters',
	typesTemplateFileName: 'custom-types',
	loadLocalesAsync: true,
	...config,
})

export const generate = async (
	translations: BaseTranslation,
	config: GeneratorConfigWithDefaultValues = {} as GeneratorConfigWithDefaultValues,
	version: TypescriptVersion,
	logger: Logger = defaultLogger,
): Promise<void> => {
	const importType = supportsImportType(version) ? ' type' : ''

	await generateBaseLocaleTemplate(config, importType)

	const hasCustomTypes = await generateTypes({ ...config, translations }, importType, version, logger)

	await generateFormattersTemplate(config, importType)

	if (hasCustomTypes) {
		await generateCustomTypesTemplate(config)
	}

	await generateUtil(config, importType)

	if (config.adapter === 'node') {
		await generateNodeAdapter(config)
	} else if (config.adapter === 'svelte') {
		await generateSvelteAdapter(config, importType)
	}
}
