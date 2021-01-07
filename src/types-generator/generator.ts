import type { LangaugeBaseTranslation } from '../core/core'
import { BASE_PATH, DEFAULT_LOCALE } from '../constants/constants'
import { generateTypes } from './generate-types'
import { generateUtil } from './generate-util'
import { generateSvelte } from './generate-svelte'
import { generateFormattersTemplate } from './generate-template-formatters'
import { generateCustomTypesTemplate } from './generate-template-types'
import { WatcherConfig } from './watcher'

export type GenerateTypesConfig = WatcherConfig & {
	locales?: string[]
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
		lazyLoad = false,
	} = config

	const hasCustomTypes = await generateTypes(translationObject, outputPath, typesFile, locales, baseLocale)

	await generateFormattersTemplate(outputPath, configTemplatePath)

	if (hasCustomTypes) {
		await generateCustomTypesTemplate(outputPath, typesTemplatePath)
	}

	await generateUtil(outputPath, utilFile, locales, baseLocale)

	if (svelte) {
		await generateSvelte(outputPath, lazyLoad, svelte, baseLocale)
	}
}
