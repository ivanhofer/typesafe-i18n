import type { GeneratorConfigWithDefaultValues } from '../../../config/src/types.mjs'
import {
	importTypes,
	jsDocFunction,
	jsDocImports,
	jsDocType,
	relativeFileImportPath,
	tsCheck,
	type
} from '../output-handler.mjs'
import { writeFileIfContainsChanges, writeFileIfNotExists } from '../utils/file.utils.mjs'
import { prettify } from '../utils/generator.utils.mjs'

const getFormattersTemplate = ({ typesFileName: typesFile }: GeneratorConfigWithDefaultValues) => {
	return `${tsCheck}

${jsDocImports(
	{ from: 'typesafe-i18n', type: 'FormattersInitializer<Locales, Formatters>', alias: 'FormattersInitializer' },
	{ from: relativeFileImportPath(typesFile), type: 'Locales' },
	{ from: relativeFileImportPath(typesFile), type: 'Formatters' },
)}

${importTypes('typesafe-i18n', 'FormattersInitializer')}
${importTypes(relativeFileImportPath(typesFile), 'Locales', 'Formatters')}

${jsDocFunction('Formatters', { type: 'Locales', name: 'locale' })}
export const initFormatters${type(`FormattersInitializer<Locales, Formatters>`)} = (locale${type('Locales')}) => {
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
