import { writeFileIfContainsChanges, writeFileIfNotExists } from '../file-utils'
import { GeneratorConfigWithDefaultValues } from '../generator'

const getFormattersTemplate = (
	{ typesFileName: typesFile, loadLocalesAsync }: GeneratorConfigWithDefaultValues,
	importType: string,
) => {
	const formattersInitializerType = `${loadLocalesAsync ? 'Async' : ''}FormattersInitializer`
	return `${importType} { ${formattersInitializerType} } from 'typesafe-i18n'
${importType} { Locales, Formatters } from './${typesFile}'

export const initFormatters: ${formattersInitializerType}<Locales, Formatters> = ${loadLocalesAsync ? 'async ' : ''
		}(locale) => {
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
	forceOverride: boolean,
): Promise<void> => {
	const { outputPath, formattersTemplateFileName: formattersTemplatePath } = config

	const configTemplate = getFormattersTemplate(config, importType)

	const write = forceOverride ? writeFileIfContainsChanges : writeFileIfNotExists
	await write(outputPath, formattersTemplatePath, configTemplate)
}
