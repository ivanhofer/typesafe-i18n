import { TYPES_TEMPLATE_FILE } from '../constants/constants'
import { writeFileIfNotExists } from './file-utils'
import { GeneratorConfigWithDefaultValues } from './generator'

const getCustomTypesTemplate = () => {
	return `// use this file to export your custom types; these types will be imported by './langauge-types.ts'`
}

type GenerateCustomTypesTemplateType = Pick<GeneratorConfigWithDefaultValues, 'outputPath' | 'typesTemplatePath'>

export const generateCustomTypesTemplate = async ({
	outputPath,
	typesTemplatePath = TYPES_TEMPLATE_FILE,
}: GenerateCustomTypesTemplateType): Promise<void> => {
	const configTemplate = getCustomTypesTemplate()

	await writeFileIfNotExists(outputPath, typesTemplatePath, configTemplate)
}
