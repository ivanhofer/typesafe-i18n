import { CONFIG_TEMPLATE_FILE } from '../constants/constants'
import { writeFileIfNotExists } from './file-utils'

const getConfigTemplate = () => {
	return `import type { LangaugeFormatters, LangaugeConfigInitializer, LangaugeLocales } from './langauge-types'

const initFormatters: (locale: LangaugeLocales) => LangaugeFormatters = (locale) => {
	const formatters: LangaugeFormatters = {
		// add your formatter functions here
	}

	return formatters
}

export const initConfig: LangaugeConfigInitializer = (locale: LangaugeLocales) => ({
	formatters: initFormatters(locale),
})
`
}

export const generateConfigTemplate = async (
	outputPath: string,
	configTemplateFile: string | undefined = CONFIG_TEMPLATE_FILE,
): Promise<void> => {
	const configTemplate = getConfigTemplate()

	await writeFileIfNotExists(outputPath, configTemplateFile, configTemplate)
}
