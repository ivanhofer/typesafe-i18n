import { join } from 'path'
import { writeFileIfNotExists } from '../file-utils'
import { GeneratorConfigWithDefaultValues } from '../generator'

const getBaseLocaleTemplate = (baseLocale: string, importType: string) => {
	return `import${importType} { LangaugeBaseTranslation } from 'langauge'

const ${baseLocale}: LangaugeBaseTranslation = {
	// TODO: your translations go here
}

export default ${baseLocale}
`
}

export const generateBaseLocaleTemplate = async (
	config: GeneratorConfigWithDefaultValues,
	importType: string,
): Promise<void> => {
	const { outputPath, baseLocale } = config

	const baseLocaleTemplate = getBaseLocaleTemplate(baseLocale, importType)

	await writeFileIfNotExists(join(outputPath, baseLocale), `index.ts`, baseLocaleTemplate)
}
