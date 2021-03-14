import { writeFileIfNotExists } from '../file-utils'
import { GeneratorConfigWithDefaultValues } from '../generator'

const getCustomTypesTemplate = ({ typesFileName: typesFile }: GeneratorConfigWithDefaultValues) => {
	return `// use this file to export your custom types; these types will be imported by './${typesFile}.ts'`
}

export const generateCustomTypesTemplate = async (config: GeneratorConfigWithDefaultValues): Promise<void> => {
	const { outputPath, typesTemplateFileName: typesTemplatePath } = config

	const customTypesTemplate = getCustomTypesTemplate(config)

	await writeFileIfNotExists(outputPath, typesTemplatePath, customTypesTemplate)
}
