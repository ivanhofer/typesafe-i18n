import { TYPES_TEMPLATE_FILE } from '../constants/constants'
import { writeFileIfNotExists } from './file-utils'

const getCustomTypesTemplate = () => {
	return `// use this file to export your custom types; these types will be imported by './langauge-types.ts'`
}

export const generateCustomTypesTemplate = async (
	outputPath: string,
	typesTemplateFile: string | undefined = TYPES_TEMPLATE_FILE,
): Promise<void> => {
	const configTemplate = getCustomTypesTemplate()

	await writeFileIfNotExists(outputPath, typesTemplateFile, configTemplate)
}
