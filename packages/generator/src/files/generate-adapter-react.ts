import type { GeneratorConfigWithDefaultValues } from '../../../config/src/types'
import { writeFileIfContainsChanges } from '../file-utils'
import { prettify } from '../generator-util'
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

const getReactUtils = ({ utilFileName, typesFileName, banner }: GeneratorConfigWithDefaultValues) => {
	return `${OVERRIDE_WARNING}${tsCheck}
${banner}

${jsDocImports(
	{
		from: 'typesafe-i18n/adapters/adapter-react',
		type: 'ReactInit<Locales, Translation, TranslationFunctions>',
		alias: 'ReactInit',
	},
	{ from: relativeFileImportPath(typesFileName), type: 'Locales' },
	{ from: relativeFileImportPath(typesFileName), type: 'Translation' },
	{ from: relativeFileImportPath(typesFileName), type: 'TranslationFunctions' },
	{ from: relativeFileImportPath(typesFileName), type: 'Formatters' },
)}

import { initI18nReact } from 'typesafe-i18n/adapters/adapter-react'
${importTypes(relativeFileImportPath(typesFileName), 'Locales', 'Translation', 'TranslationFunctions', 'Formatters')}
import { loadedLocales, loadedFormatters } from '${relativeFileImportPath(utilFileName)}'

${jsDocType('ReactInit')}
const { component: TypesafeI18n, context: I18nContext } = initI18nReact${generics(
		'Locales',
		'Translation',
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
