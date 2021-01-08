import { FORMATTERS_TEMPLATE_FILE } from '../constants/constants'
import { writeFileIfNotExists } from './file-utils'
import { GeneratorConfigWithDefaultValues } from './generator'

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

type GenerateFormattersTemplateType = Pick<GeneratorConfigWithDefaultValues, 'outputPath' | 'formattersTemplatePath'>

export const generateFormattersTemplate = async ({
	outputPath,
	formattersTemplatePath = FORMATTERS_TEMPLATE_FILE,
}: GenerateFormattersTemplateType): Promise<void> => {
	const configTemplate = getFormattersTemplate()

	await writeFileIfNotExists(outputPath, formattersTemplatePath, configTemplate)
}
