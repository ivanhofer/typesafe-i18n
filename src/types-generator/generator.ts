import type { LangaugeBaseTranslation } from '../core/core'
import { BASE_PATH, DEFAULT_LOCALE } from '../constants/constants'
import { generateTypes } from './generate-types'
import { generateUtil } from './generate-util'
import { generateSvelte } from './generate-svelte'
import { generateFormattersTemplate } from './generate-template-formatters'
import { generateCustomTypesTemplate } from './generate-template-types'

export type GenerateTypesConfig = {
	outputPath?: string
	typesFile?: string
	utilFile?: string
	baseLocale?: string
	locales?: string[]
	svelte?: boolean | string
	configTemplatePath?: string
	typesTemplatePath?: string
}

export const generate = async (
	translationObject: LangaugeBaseTranslation,
	config: GenerateTypesConfig = {} as GenerateTypesConfig,
): Promise<void> => {
	const {
		outputPath = BASE_PATH,
		typesFile,
		utilFile,
		baseLocale = DEFAULT_LOCALE,
		locales = [baseLocale],
		svelte,
		configTemplatePath,
		typesTemplatePath,
	} = config

	const hasCustomTypes = await generateTypes(translationObject, outputPath, typesFile, locales, baseLocale)

	await generateFormattersTemplate(outputPath, configTemplatePath)

	if (hasCustomTypes) {
		await generateCustomTypesTemplate(outputPath, typesTemplatePath)
	}

	await generateUtil(outputPath, utilFile, locales, baseLocale)

	if (svelte) {
		await generateSvelte(outputPath, svelte, baseLocale)
	}
}
