import type { LangaugeBaseTranslation } from '../core/core'
import { generateTypes } from './generate-types'
import { generateUtil } from './generate-util'
import { generateSvelte } from './generate-svelte'
import { generateFormattersTemplate } from './generate-template-formatters'
import { generateCustomTypesTemplate } from './generate-template-types'
import { generateBaseLocaleTemplate } from './generate-template-baseLocale'

// --------------------------------------------------------------------------------------------------------------------
// types --------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------

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
	...config,
})

export const generate = async (
	translations: LangaugeBaseTranslation,
	config: GeneratorConfigWithDefaultValues = {} as GeneratorConfigWithDefaultValues,
): Promise<void> => {
	await generateBaseLocaleTemplate(config)

	const hasCustomTypes = await generateTypes({ ...config, translations })

	await generateFormattersTemplate(config)

	if (hasCustomTypes) {
		await generateCustomTypesTemplate(config)
	}

	await generateUtil(config)

	if (config.svelte) {
		await generateSvelte(config)
	}
}
