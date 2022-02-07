import { join } from 'path'
import type { GeneratorConfigWithDefaultValues } from '../../../config/src/types'
import type { Locale } from '../../../runtime/src/core'
import { writeFileIfContainsChanges } from '../file-utils'
import { logger, prettify, sanitizePath } from '../generator-util'
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
import { getTypeNameForNamespace } from './generate-types'

// --------------------------------------------------------------------------------------------------------------------

const getNamespaceTemplate = (
	{ typesFileName, adapter, esmImports }: GeneratorConfigWithDefaultValues,
	locale: string,
	namespace: string,
) => {
	const namespaceTypeName = getTypeNameForNamespace(namespace)

	const sanitizedLocale = sanitizePath(locale)
	const sanitizedNamespace = sanitizePath(namespace)

	const variableName = `${sanitizedLocale}_${sanitizedNamespace}`

	const defaultExport =
		shouldGenerateJsDoc && adapter !== 'svelte' && !esmImports ? 'module.exports =' : 'export default'

	return `${tsCheck}
${importTypes(relativeFileImportPath(`../../${typesFileName}`), namespaceTypeName)}

${jsDocImports({ from: relativeFileImportPath(`../../${typesFileName}`), type: namespaceTypeName })}

${jsDocType(namespaceTypeName)}
const ${variableName}${type(namespaceTypeName)} = {
	// TODO: insert translations
}

${defaultExport} ${variableName}
`
}

export const generateNamespaceTemplate = async (
	config: GeneratorConfigWithDefaultValues,
	locale: Locale,
	namespace: string,
): Promise<void> => {
	const { outputPath } = config

	const localeTemplate = getNamespaceTemplate(config, locale, namespace)

	logger.info(`creating boilerplate for locale '${locale}' and namespace '${namespace}'`)

	await writeFileIfContainsChanges(join(outputPath, locale, namespace), `index${fileEnding}`, prettify(localeTemplate))
}
