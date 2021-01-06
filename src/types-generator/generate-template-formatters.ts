import { FORMATTERS_TEMPLATE_FILE } from '../constants/constants'
import { writeFileIfNotExists } from './file-utils'

const getFormattersTemplate = () => {
	return `import type { LangaugeFormatters, LangaugeFormattersInitializer } from './langauge-types'

export const initFormatters: LangaugeFormattersInitializer = (locale) => {
	const formatters: LangaugeFormatters = {
		// add your formatter functions here
	}

	return formatters
}
`
}

export const generateFormattersTemplate = async (
	outputPath: string,
	formattersTemplateFile: string | undefined = FORMATTERS_TEMPLATE_FILE,
): Promise<void> => {
	const configTemplate = getFormattersTemplate()

	await writeFileIfNotExists(outputPath, formattersTemplateFile, configTemplate)
}
