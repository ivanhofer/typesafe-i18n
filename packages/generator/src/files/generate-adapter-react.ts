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
		from: 'typesafe-i18n/react',
		type: 'ReactInit<Locales, Translations, TranslationFunctions>',
		alias: 'ReactInit',
	},
	{ from: relativeFileImportPath(typesFileName), type: 'Locales' },
	{ from: relativeFileImportPath(typesFileName), type: 'Translations' },
	{ from: relativeFileImportPath(typesFileName), type: 'TranslationFunctions' },
	{ from: relativeFileImportPath(typesFileName), type: 'Formatters' },
)}

import { initI18nReact } from 'typesafe-i18n/react'
${importTypes(relativeFileImportPath(typesFileName), 'Locales', 'Translations', 'TranslationFunctions', 'Formatters')}
import { loadedLocales, loadedFormatters } from '${relativeFileImportPath(utilFileName)}'

${jsDocType('ReactInit')}
const { component: TypesafeI18n, context: I18nContext } = initI18nReact${generics(
		'Locales',
		'Translations',
		'TranslationFunctions',
		'Formatters',
	)}(loadedLocales, loadedFormatters)

export { I18nContext }

export default TypesafeI18n
`
}

export const generateReactAdapter = async (config: GeneratorConfigWithDefaultValues): Promise<void> => {
	const { outputPath } = config

	const reactUtils = getReactUtils(config)

	const fileName = config.adapterFileName || 'i18n-react'
	await writeFileIfContainsChanges(outputPath, `${fileName}${fileEnding}x`, prettify(reactUtils))
}
