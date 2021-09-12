import { join } from 'path'
import { writeFileIfContainsChanges, writeFileIfNotExists } from '../file-utils'
import { GeneratorConfigWithDefaultValues } from '../generate-files'
import { prettify, sanitizeLocale } from '../generator-util'
import { fileEnding, importTypes, jsDocImports, jsDocType, shouldGenerateJsDoc, tsCheck, type } from '../output-handler'

const getBaseLocaleTemplate = (baseLocale: string) => {
	const sanitizedLocale = sanitizeLocale(baseLocale)

	return `${tsCheck}
${importTypes('typesafe-i18n', 'BaseTranslation')}

${jsDocImports({ from: `typesafe-i18n`, type: 'BaseTranslation' })}

${jsDocType('BaseTranslation')}
${shouldGenerateJsDoc ? 'module.exports' : `const ${sanitizedLocale}${type('BaseTranslation')}`} = {
	// TODO: your translations go here
}

${shouldGenerateJsDoc ? '' : `export default ${sanitizedLocale}`}
`
}

export const generateBaseLocaleTemplate = async (
	config: GeneratorConfigWithDefaultValues,
	forceOverride: boolean,
): Promise<void> => {
	const { outputPath, baseLocale } = config

	const baseLocaleTemplate = getBaseLocaleTemplate(baseLocale)

	const write = forceOverride ? writeFileIfContainsChanges : writeFileIfNotExists
	await write(join(outputPath, baseLocale), `index${fileEnding}`, prettify(baseLocaleTemplate))
}
