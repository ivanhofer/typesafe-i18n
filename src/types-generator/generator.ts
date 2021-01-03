import type { LangaugeBaseTranslation } from '../core/core'
import { BASE_PATH, TYPES_FILE, UTIL_FILE, DEFAULT_LOCALE } from '../constants/constants'
import { generateTypes } from './generate-types'
import { generateUtil } from './generate-util'

export type GenerateTypesConfig = {
	outputPath?: string
	typesFile?: string
	utilFile?: string
	baseLocale?: string
	locales?: string[]
}

export const generate = async (
	translationObject: LangaugeBaseTranslation,
	config: GenerateTypesConfig = {} as GenerateTypesConfig,
): Promise<void> => {
	const {
		outputPath = BASE_PATH,
		typesFile = TYPES_FILE,
		utilFile = UTIL_FILE,
		baseLocale = DEFAULT_LOCALE,
		locales = [baseLocale],
	} = config

	await generateTypes(translationObject, outputPath, typesFile, locales, baseLocale)

	await generateUtil(outputPath, utilFile, locales, baseLocale)
}
