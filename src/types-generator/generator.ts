import type { LangaugeBaseTranslation } from '../core/core'
import { generateTypes } from './files/generate-types'
import { generateUtil } from './files/generate-util'
import { generateSvelte } from './files/generate-svelte'
import { generateFormattersTemplate } from './files/generate-template-formatters'
import { generateCustomTypesTemplate } from './files/generate-template-types'
import { generateBaseLocaleTemplate } from './files/generate-template-baseLocale'
import { supportsImportType, TsVersion } from './generator-util'

// --------------------------------------------------------------------------------------------------------------------
// types --------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------

// export type TsVersion =

export type GeneratorConfig = {
	baseLocale?: string
	locales?: string[]

	tempPath?: string
	outputPath?: string
	typesFileName?: string
	utilFileName?: string
	formattersTemplateFileName?: string
	typesTemplateFileName?: string

	svelte?: boolean | string
	lazyLoad?: boolean

	tsVersion?: TsVersion
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
	lazyLoad: boolean
	tsVersion: TsVersion
}

// --------------------------------------------------------------------------------------------------------------------
// implementation -----------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------

export const setDefaultConfigValuesIfMissing = (config: GeneratorConfig): GeneratorConfigWithDefaultValues => ({
	baseLocale: 'en',
	locales: [],
	tempPath: './node_modules/langauge/temp-output/',
	outputPath: './src/langauge/',
	typesFileName: 'langauge-types',
	utilFileName: 'langauge-util',
	formattersTemplateFileName: 'formatters',
	typesTemplateFileName: 'custom-types',
	lazyLoad: true,
	tsVersion: TsVersion['>=4.1'],
	...config,
})

export const generate = async (
	translations: LangaugeBaseTranslation,
	config: GeneratorConfigWithDefaultValues = {} as GeneratorConfigWithDefaultValues,
): Promise<void> => {
	const importType = supportsImportType(config.tsVersion) ? ' type' : ''

	await generateBaseLocaleTemplate(config, importType)

	const hasCustomTypes = await generateTypes({ ...config, translations }, importType)

	await generateFormattersTemplate(config, importType)

	if (hasCustomTypes) {
		await generateCustomTypesTemplate(config)
	}

	await generateUtil(config, importType)

	if (config.svelte) {
		await generateSvelte(config, importType)
	}
}
