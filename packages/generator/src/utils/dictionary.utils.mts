import { isString } from 'typesafe-utils'
import type { GeneratorConfigWithDefaultValues } from '../../../config/src/types.mjs'
import type { BaseTranslation, Locale } from '../../../runtime/src/core.mjs'
import {
	defaultExportStatement,
	importTypes,
	jsDocImports,
	jsDocSatisfies,
	relativeFileImportPath,
	satisfies,
	tsCheck
} from '../output-handler.mjs'
import { sanitizePath, wrapObjectKeyIfNeeded } from './generator.utils.mjs'
import { getTypeNameForNamespace } from './namespaces.utils.mjs'

// --------------------------------------------------------------------------------------------------------------------

export const getDictionaryTemplate = (
	{ banner, typesFileName }: GeneratorConfigWithDefaultValues,
	locale: Locale,
	namespace: string | undefined,
	isBaseLocale: boolean,
	translations: BaseTranslation | BaseTranslation[] | undefined = undefined,
	editHint = '',
	showBanner = false,
) => {
	const typeOfDictionary = isBaseLocale
		? 'BaseTranslation'
		: namespace
		? getTypeNameForNamespace(namespace)
		: 'Translation'

	const sanitizedLocale = sanitizePath(locale)

	const variableName = namespace ? `${sanitizedLocale}_${sanitizePath(namespace)}` : sanitizedLocale

	const translationsMap = translations ? mapTranslationsToString(translations) : ''

	const hint = editHint
		? `	// ${editHint}
`
		: ''

	const bannerIfNeeded = showBanner
		? `
${banner}`
		: ''

	const relativePathPrefix = namespace ? '../../' : '../'

	return `${tsCheck}${bannerIfNeeded}
${importTypes(relativeFileImportPath(`${relativePathPrefix}${typesFileName}`), typeOfDictionary)}

${jsDocImports({
	from: relativeFileImportPath(`${relativePathPrefix}${typesFileName}`),
	type: typeOfDictionary,
})}

${jsDocSatisfies(typeOfDictionary)}
const ${variableName}${satisfies(
		typeOfDictionary,
		`{
${hint}${translationsMap}
}`,
	)}

${defaultExportStatement} ${variableName}
`
}

// --------------------------------------------------------------------------------------------------------------------

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

// --------------------------------------------------------------------------------------------------------------------

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
