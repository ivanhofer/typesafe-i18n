import { join } from 'path'
import { writeFileIfContainsChanges, writeFileIfNotExists } from '../file-utils'
import { GeneratorConfigWithDefaultValues } from '../generate-files'
import { sanitizeLocale } from '../generator-util'
import { fileEnding, importTypes, type } from '../output-handler'

const getBaseLocaleTemplate = (baseLocale: string) => {
	const sanitizedLocale = sanitizeLocale(baseLocale)

	return `${importTypes('typesafe-i18n', 'BaseTranslation')}

const ${sanitizedLocale}${type('BaseTranslation')} = {
	// TODO: your translations go here
}

export default ${sanitizedLocale}
`
}

export const generateBaseLocaleTemplate = async (
	config: GeneratorConfigWithDefaultValues,
	forceOverride: boolean,
): Promise<void> => {
	const { outputPath, baseLocale } = config

	const baseLocaleTemplate = getBaseLocaleTemplate(baseLocale)

	const write = forceOverride ? writeFileIfContainsChanges : writeFileIfNotExists
	await write(join(outputPath, baseLocale), `index${fileEnding}`, baseLocaleTemplate)
}
