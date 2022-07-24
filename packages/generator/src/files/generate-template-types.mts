import type { GeneratorConfigWithDefaultValues } from '../../../config/src/types.mjs'
import { fileEndingForTypesFile } from '../output-handler.mjs'
import { writeFileIfContainsChanges, writeFileIfNotExists } from '../utils/file.utils.mjs'
import { prettify } from '../utils/generator.utils.mjs'

const getCustomTypesTemplate = ({ typesFileName: typesFile }: GeneratorConfigWithDefaultValues) => {
	return `// use this file to export your custom types; these types will be imported by './${typesFile}${fileEndingForTypesFile}'`
}

export const generateCustomTypesTemplate = async (
	config: GeneratorConfigWithDefaultValues,
	forceOverride: boolean,
): Promise<void> => {
	const { outputPath, typesTemplateFileName: typesTemplatePath } = config

	const customTypesTemplate = getCustomTypesTemplate(config)

	const write = forceOverride ? writeFileIfContainsChanges : writeFileIfNotExists
	await write(outputPath, `${typesTemplatePath}${fileEndingForTypesFile}`, prettify(customTypesTemplate))
}
