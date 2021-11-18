import type { GeneratorConfigWithDefaultValues } from '../../../config/src/types'
import { writeFileIfContainsChanges, writeFileIfNotExists } from '../file-utils'
import { prettify } from '../generator-util'
import {
	importTypes,
	jsDocFunction,
	jsDocImports,
	jsDocType,
	relativeFileImportPath,
	tsCheck,
	type,
} from '../output-handler'

const getFormattersTemplate = ({ typesFileName: typesFile, loadLocalesAsync }: GeneratorConfigWithDefaultValues) => {
	const formattersInitializerType = `${loadLocalesAsync ? 'Async' : ''}FormattersInitializer`
	return `${tsCheck}

${jsDocImports(
	{ from: 'typesafe-i18n', type: 'FormattersInitializer<Locales, Formatters>', alias: 'FormattersInitializer' },
	{ from: relativeFileImportPath(typesFile), type: 'Locales' },
	{ from: relativeFileImportPath(typesFile), type: 'Formatters' },
)}

${importTypes('typesafe-i18n', formattersInitializerType)}
${importTypes(relativeFileImportPath(typesFile), 'Locales', 'Formatters')}

${jsDocFunction(loadLocalesAsync ? 'Promise<Formatters>' : 'Formatters', { type: 'Locales', name: 'locale' })}
export const initFormatters${type(`${formattersInitializerType}<Locales, Formatters>`)} = ${
		loadLocalesAsync ? 'async ' : ''
	}(locale${type('Locales')}) => {
	${jsDocType('Formatters')}
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
