import { join } from 'path'
import type { GeneratorConfigWithDefaultValues } from '../../../config/src/types'
import type { BaseTranslation, Locale } from '../../../runtime/src/core'
import { writeFileIfContainsChanges } from '../file-utils'
import { logger, prettify, sanitizePath } from '../generator-util'
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
import { mapTranslationsToString } from './generate-template-locale'
import { getTypeNameForNamespace } from './generate-types'

// --------------------------------------------------------------------------------------------------------------------

const getNamespaceTemplate = (
	{ typesFileName, banner }: GeneratorConfigWithDefaultValues,
	locale: string,
	namespace: string,
	isBaseLocale: boolean,
	translations: BaseTranslation | BaseTranslation[] | undefined = undefined,
	editHint = '',
	showBanner = false,
) => {
	const typeOfDictionary = isBaseLocale ? 'BaseTranslation' : getTypeNameForNamespace(namespace)

	const sanitizedLocale = sanitizePath(locale)
	const sanitizedNamespace = sanitizePath(namespace)

	const variableName = `${sanitizedLocale}_${sanitizedNamespace}`

	const translationsMap =
		(translations &&
			`${mapTranslationsToString(translations)}
`) ||
		''

	const hint = editHint || !translationsMap ? `	// ${editHint || 'TODO: insert translations'}` : ''

	const bannerIfNeeded = showBanner
		? `
${banner}`
		: ''

	return `${tsCheck}${bannerIfNeeded}
${importTypes(relativeFileImportPath(`../../${typesFileName}`), typeOfDictionary)}

${jsDocImports({ from: relativeFileImportPath(`../../${typesFileName}`), type: typeOfDictionary })}

${jsDocType(typeOfDictionary)}
const ${variableName}${type(typeOfDictionary)} = {
${hint}${translationsMap}
}

${defaultExportStatement} ${variableName}
`
}

export const generateNamespaceTemplate = async (
	config: GeneratorConfigWithDefaultValues,
	locale: Locale,
	namespace: string,
	translations: BaseTranslation | BaseTranslation[] | undefined = undefined,
	editHint = '',
	showBanner = false,
): Promise<void> => {
	const { outputPath, baseLocale } = config

	const isBaseLocale = baseLocale === locale

	const localeTemplate = getNamespaceTemplate(
		config,
		locale,
		namespace,
		isBaseLocale,
		translations,
		editHint,
		showBanner,
	)

	logger.info(`creating boilerplate for locale '${locale}' and namespace '${namespace}'`)

	await writeFileIfContainsChanges(join(outputPath, locale, namespace), `index${fileEnding}`, prettify(localeTemplate))
}
