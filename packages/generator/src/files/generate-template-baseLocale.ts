import { join } from 'path'
import { writeFileIfContainsChanges, writeFileIfNotExists } from '../file-utils'
import { GeneratorConfigWithDefaultValues } from '../generate-files'
import { sanitizeLocale } from '../generator-util'

const getBaseLocaleTemplate = (baseLocale: string, importType: string) => {
	const sanitizedLocale = sanitizeLocale(baseLocale)

	return `${importType} { BaseTranslation } from 'typesafe-i18n'

const ${sanitizedLocale}: BaseTranslation = {
	// TODO: your translations go here
}

export default ${sanitizedLocale}
`
}

export const generateBaseLocaleTemplate = async (
	config: GeneratorConfigWithDefaultValues,
	importType: string,
	forceOverride: boolean,
): Promise<void> => {
	const { outputPath, baseLocale } = config

	const baseLocaleTemplate = getBaseLocaleTemplate(baseLocale, importType)

	const write = forceOverride ? writeFileIfContainsChanges : writeFileIfNotExists
	await write(join(outputPath, baseLocale), `index.ts`, baseLocaleTemplate)
}
