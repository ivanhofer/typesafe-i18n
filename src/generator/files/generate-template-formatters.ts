import { writeFileIfNotExists } from '../file-utils'
import { GeneratorConfigWithDefaultValues } from '../generator'

const getFormattersTemplate = ({ typesFileName: typesFile }: GeneratorConfigWithDefaultValues, importType: string) => {
	return `import${importType} { FormattersInitializer } from 'typesafe-i18n'
import${importType} { Locales, Formatters } from './${typesFile}'

export const initFormatters: FormattersInitializer<Locales, Formatters> = (locale) => {
	const formatters: Formatters = {
		// add your formatter functions here
	}

	return formatters
}
`
}

export const generateFormattersTemplate = async (
	config: GeneratorConfigWithDefaultValues,
	importType: string,
): Promise<void> => {
	const { outputPath, formattersTemplateFileName: formattersTemplatePath } = config

	const configTemplate = getFormattersTemplate(config, importType)

	await writeFileIfNotExists(outputPath, formattersTemplatePath, configTemplate)
}
