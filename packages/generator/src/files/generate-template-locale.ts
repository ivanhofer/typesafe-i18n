import { join } from 'path'
import { isString } from 'typesafe-utils'
import type { GeneratorConfigWithDefaultValues } from '../../../config/src/types'
import type { BaseTranslation, Locale } from '../../../runtime/src/core'
import { writeFileIfContainsChanges } from '../file-utils'
import { prettify, sanitizePath, wrapObjectKeyIfNeeded } from '../generator-util'
import {
	defaultExportStatement,
	fileEnding,
	importTypes,
	jsDocImports,
	jsDocType,
	relativeFileImportPath,
	tsCheck,
	type,
} from '../output-handler'

// --------------------------------------------------------------------------------------------------------------------

// TODO: move to helper file

export const mapTranslationsToString = (
	translations: BaseTranslation | BaseTranslation[] | Readonly<BaseTranslation> | Readonly<BaseTranslation[]>,
	level = 1,
) => Object.entries(translations).map(mapTranslationToString.bind(null, level)).join('\n')

const mapTranslationToString = (
	level: number,
	[key, value]: [
		string,
		BaseTranslation | BaseTranslation[] | Readonly<BaseTranslation> | Readonly<BaseTranslation[]> | string,
	],
): string => {
	const inset = new Array(level).fill('	').join('')
	if (isString(value)) return `${inset}${wrapObjectKeyIfNeeded(key)}: ${getWrappedString(value)},`
	else
		return `${inset}${wrapObjectKeyIfNeeded(key)}: {
${mapTranslationsToString(value, level + 1)}
${inset}},`
}

export const getWrappedString = (text: string, lookForStringType = false): string => {
	const containsSingleQuotes = text.includes("'")
	const containsDoubleQuotes = text.includes('"')
	const containsNewLines = text.includes('\n')
	const containsVariables = text.includes('${string}')

	let wrappingString = "'"
	if (containsNewLines || (containsSingleQuotes && containsDoubleQuotes) || (lookForStringType && containsVariables)) {
		wrappingString = '`'
	} else if (containsSingleQuotes) {
		wrappingString = '"'
	}

	return `${wrappingString}${text.replace(new RegExp(`${wrappingString}/g`), `\\${wrappingString}`)}${wrappingString}`
}

// --------------------------------------------------------------------------------------------------------------------

const getLocaleTemplate = (
	{ banner, typesFileName }: GeneratorConfigWithDefaultValues,
	locale: Locale,
	isBaseLocale: boolean,
	translations: BaseTranslation | BaseTranslation[] | undefined,
	editHint: string,
	showBanner: boolean,
) => {
	const typeOfDictionary = isBaseLocale ? 'BaseTranslation' : 'Translation'
	const sanitizedLocale = sanitizePath(locale)

	const translationsMap = translations && mapTranslationsToString(translations)

	const hint = editHint
		? `	// ${editHint}
`
		: ''

	const bannerIfNeeded = showBanner
		? `
${banner}`
		: ''

	return `${tsCheck}${bannerIfNeeded}
${importTypes(relativeFileImportPath(`../${typesFileName}`), typeOfDictionary)}

${jsDocImports({ from: relativeFileImportPath(`../${typesFileName}`), type: typeOfDictionary })}

${jsDocType(typeOfDictionary)}
const ${sanitizedLocale}${type(typeOfDictionary)} = {
${hint}${translationsMap}
}

${defaultExportStatement} ${sanitizedLocale}
`
}

export const generateLocaleTemplate = async (
	config: GeneratorConfigWithDefaultValues,
	locale: Locale,
	translations: BaseTranslation | BaseTranslation[] | undefined = undefined,
	editHint = '',
	showBanner = false,
): Promise<void> => {
	const { outputPath, baseLocale } = config

	const isBaseLocale = baseLocale === locale

	const localeTemplate = getLocaleTemplate(config, locale, isBaseLocale, translations, editHint, showBanner)

	await writeFileIfContainsChanges(join(outputPath, locale), `index${fileEnding}`, prettify(localeTemplate))
}
