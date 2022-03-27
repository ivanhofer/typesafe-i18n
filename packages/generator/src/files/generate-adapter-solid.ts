import type { GeneratorConfigWithDefaultValues } from '../../../config/src/types'
import {
	fileEnding,
	generics,
	importTypes,
	jsDocImports,
	jsDocType,
	OVERRIDE_WARNING,
	relativeFileImportPath,
	tsCheck,
} from '../output-handler'
import { writeFileIfContainsChanges } from '../utils/file.utils'
import { prettify } from '../utils/generator.utils'

const getReactUtils = ({ utilFileName, typesFileName, banner }: GeneratorConfigWithDefaultValues) => {
	return `${OVERRIDE_WARNING}${tsCheck}
${banner}

${jsDocImports(
	{
		from: 'typesafe-i18n/solid',
		type: 'SolidInit<Locales, Translations, TranslationFunctions>',
		alias: 'SolidInit',
	},
	{ from: relativeFileImportPath(typesFileName), type: 'Formatters' },
	{ from: relativeFileImportPath(typesFileName), type: 'Locales' },
	{ from: relativeFileImportPath(typesFileName), type: 'TranslationFunctions' },
	{ from: relativeFileImportPath(typesFileName), type: 'Translations' },
)}

import { initI18nSolid } from 'typesafe-i18n/solid'
${importTypes(relativeFileImportPath(typesFileName), 'Formatters', 'Locales', 'TranslationFunctions', 'Translations')}
import { loadedFormatters, loadedLocales } from '${relativeFileImportPath(utilFileName)}'

${jsDocType('SolidInit')}
const { TypesafeI18n, useI18nContext } = initI18nSolid${generics(
		'Locales',
		'Translations',
		'TranslationFunctions',
		'Formatters',
	)}(loadedLocales, loadedFormatters)

export { useI18nContext }

export default TypesafeI18n
`
}

export const generateSolidAdapter = async (config: GeneratorConfigWithDefaultValues): Promise<void> => {
	const { outputPath } = config

	const reactUtils = getReactUtils(config)

	const fileName = config.adapterFileName || 'i18n-solid'
	await writeFileIfContainsChanges(outputPath, `${fileName}${fileEnding}`, prettify(reactUtils))
}
