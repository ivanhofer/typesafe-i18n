import { writeFileIfContainsChanges, writeFileIfNotExists } from '../file-utils'
import { GeneratorConfigWithDefaultValues } from '../generate-files'
import { prettify } from '../generator-util'
import { importTypes, tsCheck, type } from '../output-handler'

const getFormattersTemplate = (
	{ typesFileName: typesFile, loadLocalesAsync }: GeneratorConfigWithDefaultValues,
) => {
	const formattersInitializerType = `${loadLocalesAsync ? 'Async' : ''}FormattersInitializer`
	return `${tsCheck}
${importTypes('typesafe-i18n', formattersInitializerType)}
${importTypes(`./${typesFile}`, 'Locales', 'Formatters')}

export const initFormatters${type(`${formattersInitializerType}<Locales, Formatters>`)} = ${loadLocalesAsync ? 'async ' : ''
		}(locale${type('Locales')}) => {
	const formatters${type('Formatters')} = {
		// add your formatter functions here
	}

	return formatters
}
`
}

export const generateFormattersTemplate = async (
	config: GeneratorConfigWithDefaultValues,
	forceOverride: boolean,
): Promise<void> => {
	const { outputPath, formattersTemplateFileName: formattersTemplatePath } = config

	const configTemplate = getFormattersTemplate(config)

	const write = forceOverride ? writeFileIfContainsChanges : writeFileIfNotExists
	await write(outputPath, formattersTemplatePath, prettify(configTemplate))
}
