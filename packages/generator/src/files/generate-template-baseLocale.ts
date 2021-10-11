import { BaseTranslation } from 'packages/core/src/core'
import { join } from 'path'
import { isString } from 'typesafe-utils'
import { writeFileIfContainsChanges, writeFileIfNotExists } from '../file-utils'
import { GeneratorConfigWithDefaultValues } from '../generate-files'
import { prettify, sanitizeLocale } from '../generator-util'
import { fileEnding, importTypes, jsDocImports, jsDocType, shouldGenerateJsDoc, tsCheck, type } from '../output-handler'

// --------------------------------------------------------------------------------------------------------------------

const mapTranslationsToString = (translations: BaseTranslation, level = 1) =>
	Object.entries(translations).map(mapTranslationToString.bind(null, level)).join('\n')

const mapTranslationToString = (level: number, [key, value]: [string, BaseTranslation | string]): string => {
	const inset = new Array(level).fill(`	`).join('')
	if (isString(value)) return `${inset}${key}: '${value.replace(/'/g, "\\'")}',`
	else
		return `${inset}${key}: {
${mapTranslationsToString(value, level + 1)}
${inset}},`
}

// --------------------------------------------------------------------------------------------------------------------

const getBaseLocaleTemplate = (
	{ baseLocale, banner }: GeneratorConfigWithDefaultValues,
	translations: BaseTranslation | undefined,
	firstLaunchOfGenerator: boolean,
) => {
	const sanitizedLocale = sanitizeLocale(baseLocale)

	const translationsMap = translations && mapTranslationsToString(translations)

	const dummyTranslations = firstLaunchOfGenerator
		? `	// TODO: your translations go here
	HI: "Hi {name}, welcome to 'typesafe-i18n'",`
		: ''

	const bannerIfNeeded = translationsMap
		? `
${banner}`
		: ''

	return `${tsCheck}${bannerIfNeeded}
${importTypes('typesafe-i18n', 'BaseTranslation')}

${jsDocImports({ from: `typesafe-i18n`, type: 'BaseTranslation' })}

${jsDocType('BaseTranslation')}
${shouldGenerateJsDoc ? 'module.exports' : `const ${sanitizedLocale}${type('BaseTranslation')}`} = {
${translationsMap || dummyTranslations}
}

${shouldGenerateJsDoc ? '' : `export default ${sanitizedLocale}`}
`
}

export const generateBaseLocaleTemplate = async (
	config: GeneratorConfigWithDefaultValues,
	forceOverride: boolean,
	firstLaunchOfGenerator: boolean,
	translations: BaseTranslation | undefined = undefined,
): Promise<void> => {
	const { outputPath, baseLocale } = config

	const baseLocaleTemplate = getBaseLocaleTemplate(config, translations, firstLaunchOfGenerator)

	const write = forceOverride ? writeFileIfContainsChanges : writeFileIfNotExists
	await write(join(outputPath, baseLocale), `index${fileEnding}`, prettify(baseLocaleTemplate))
}
