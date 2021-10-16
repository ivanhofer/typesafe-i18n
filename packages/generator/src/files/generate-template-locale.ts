import { BaseTranslation, Locale } from 'packages/core/src/core'
import { join } from 'path'
import { isString } from 'typesafe-utils'
import { writeFileIfContainsChanges } from '../file-utils'
import { GeneratorConfigWithDefaultValues } from '../generate-files'
import { prettify, sanitizeLocale } from '../generator-util'
import {
	fileEnding,
	importTypes,
	jsDocImports,
	jsDocType,
	relativeFileImportPath,
	shouldGenerateJsDoc,
	tsCheck,
	type,
} from '../output-handler'

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

const getLocaleTemplate = (
	{ banner, typesFileName, esmImports }: GeneratorConfigWithDefaultValues,
	locale: Locale,
	isBaseLocale: boolean,
	translations: BaseTranslation | undefined,
	editHint: string,
	showBanner: boolean,
) => {
	const typeToImport = isBaseLocale ? 'BaseTranslation' : 'Translation'
	const sanitizedLocale = sanitizeLocale(locale)

	const translationsMap = translations && mapTranslationsToString(translations)

	const defaultExport = shouldGenerateJsDoc && !esmImports ? 'module.exports =' : 'export default'

	const hint = editHint
		? `	// ${editHint}
`
		: ''

	const bannerIfNeeded = showBanner
		? `
${banner}`
		: ''

	return `${tsCheck}${bannerIfNeeded}
${importTypes(relativeFileImportPath(`../${typesFileName}`), typeToImport)}

${jsDocImports({ from: relativeFileImportPath(`../${typesFileName}`), type: typeToImport })}

${jsDocType(typeToImport)}
const ${sanitizedLocale}${type(typeToImport)} = {
${hint}${translationsMap}
}

${defaultExport} ${sanitizedLocale}
`
}

export const generateBaseLocaleTemplate = async (
	config: GeneratorConfigWithDefaultValues,
	translations: BaseTranslation | undefined = undefined,
	editHint = '',
	showBanner = false,
): Promise<void> => generateLocaleTemplate(config, config.baseLocale, translations, editHint, showBanner)

export const generateLocaleTemplate = async (
	config: GeneratorConfigWithDefaultValues,
	locale: Locale,
	translations: BaseTranslation | undefined = undefined,
	editHint = '',
	showBanner = false,
): Promise<void> => {
	const { outputPath, baseLocale } = config

	const isBaseLocale = baseLocale === locale

	const localeTemplate = getLocaleTemplate(config, locale, isBaseLocale, translations, editHint, showBanner)

	await writeFileIfContainsChanges(join(outputPath, locale), `index${fileEnding}`, prettify(localeTemplate))
}
