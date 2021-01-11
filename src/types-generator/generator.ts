import type { LangaugeBaseTranslation } from '../core/core'
import {
	BASE_PATH,
	DEFAULT_LOCALE,
	FORMATTERS_TEMPLATE_FILENAME,
	TEMP_PATH,
	TYPES_FILENAME,
	TYPES_TEMPLATE_FILENAME,
	UTIL_FILENAME,
} from '../constants/constants'
import { generateTypes } from './generate-types'
import { generateUtil } from './generate-util'
import { generateSvelte } from './generate-svelte'
import { generateFormattersTemplate } from './generate-template-formatters'
import { generateCustomTypesTemplate } from './generate-template-types'

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
	baseLocale: DEFAULT_LOCALE,
	locales: [],
	tempPath: TEMP_PATH,
	outputPath: BASE_PATH,
	typesFileName: TYPES_FILENAME,
	utilFileName: UTIL_FILENAME,
	formattersTemplateFileName: FORMATTERS_TEMPLATE_FILENAME,
	typesTemplateFileName: TYPES_TEMPLATE_FILENAME,
	lazyLoad: true,
	...config,
})

export const generate = async (
	translationObject: LangaugeBaseTranslation,
	config: GeneratorConfigWithDefaultValues = {} as GeneratorConfigWithDefaultValues,
): Promise<void> => {
	const hasCustomTypes = await generateTypes({ ...config, translationObject })

	await generateFormattersTemplate(config)

	if (hasCustomTypes) {
		await generateCustomTypesTemplate(config)
	}

	await generateUtil(config)

	if (config.svelte) {
		await generateSvelte(config)
	}
}
