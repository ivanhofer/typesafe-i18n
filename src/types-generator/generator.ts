import type { LangaugeBaseTranslation } from '../core/core'
import { BASE_PATH, DEFAULT_LOCALE, TEMP_PATH } from '../constants/constants'
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
	typesFile?: string
	utilFile?: string
	formattersTemplatePath?: string
	typesTemplatePath?: string

	svelte?: boolean | string
	lazyLoad?: boolean
}

export type GeneratorConfigWithDefaultValues = GeneratorConfig & {
	baseLocale: string
	locales: string[]
	tempPath: string
	outputPath: string
	lazyLoad: boolean
}

// --------------------------------------------------------------------------------------------------------------------
// implementation -----------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------

export const setDefaultConfigValuesIfMissing = (config: GeneratorConfig): GeneratorConfigWithDefaultValues => ({
	...config,
	baseLocale: config.baseLocale ?? DEFAULT_LOCALE,
	locales: config.locales ?? [config.baseLocale ?? DEFAULT_LOCALE],
	tempPath: config.tempPath ?? TEMP_PATH,
	outputPath: config.outputPath ?? BASE_PATH,
	lazyLoad: true,
})

export const generate = async (
	translationObject: LangaugeBaseTranslation,
	config: GeneratorConfigWithDefaultValues = {} as GeneratorConfigWithDefaultValues,
): Promise<void> => {
	const {
		baseLocale,
		locales,

		outputPath,
		typesFile,
		utilFile,
		formattersTemplatePath,
		typesTemplatePath,

		svelte,
		lazyLoad,
	} = config

	const hasCustomTypes = await generateTypes({ translationObject, outputPath, typesFile, baseLocale, locales })

	await generateFormattersTemplate({ outputPath, formattersTemplatePath })

	if (hasCustomTypes) {
		await generateCustomTypesTemplate({ outputPath, typesTemplatePath })
	}

	await generateUtil({ outputPath, utilFile, baseLocale, locales })

	if (svelte) {
		await generateSvelte({ outputPath, svelte, baseLocale, lazyLoad })
	}
}
