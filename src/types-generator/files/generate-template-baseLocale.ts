import { join } from 'path'
import { writeFileIfNotExists } from '../file-utils'
import { GeneratorConfigWithDefaultValues } from '../generator'
import { sanitizeLocale } from '../generator-util'

const getBaseLocaleTemplate = (baseLocale: string, importType: string) => {
	const sanitizedLocale = sanitizeLocale(baseLocale)

	return `import${importType} { LangaugeBaseTranslation } from 'langauge'

const ${sanitizedLocale}: LangaugeBaseTranslation = {
	// TODO: your translations go here
}

export default ${sanitizedLocale}
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
