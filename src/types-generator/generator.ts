import { LangaugeBaseTranslation } from '../types/types'
import { DEFAULT_LOCALE } from '../constants/constants'
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
		outputPath = './src/langauge/',
		typesFile = 'langauge-types.ts',
		utilFile = 'langauge-util.ts',
		baseLocale = DEFAULT_LOCALE,
		locales = [baseLocale],
	} = config

	await generateTypes(translationObject, outputPath, typesFile, locales, baseLocale)

	await generateUtil(outputPath, utilFile, locales, baseLocale)
}
