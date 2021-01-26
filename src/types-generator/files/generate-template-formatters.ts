import { writeFileIfNotExists } from '../file-utils'
import { GeneratorConfigWithDefaultValues } from '../generator'

const getFormattersTemplate = ({ typesFileName: typesFile }: GeneratorConfigWithDefaultValues) => {
	return `import type { LangaugeFormatters, LangaugeFormattersInitializer } from './${typesFile}'

export const initFormatters: LangaugeFormattersInitializer = (locale) => {
	const formatters: LangaugeFormatters = {
		// add your formatter functions here
	}

	return formatters
}
`
}

export const generateFormattersTemplate = async (config: GeneratorConfigWithDefaultValues): Promise<void> => {
	const { outputPath, formattersTemplateFileName: formattersTemplatePath } = config

	const configTemplate = getFormattersTemplate(config)

	await writeFileIfNotExists(outputPath, formattersTemplatePath, configTemplate)
}
