import type { GeneratorConfigWithDefaultValues } from '../../../config/src/types.mjs'
import {
	fileEnding,
	generics,
	importTypes,
	jsDocImports,
	jsDocType,
	OVERRIDE_WARNING,
	relativeFileImportPath,
	tsCheck,
	type
} from '../output-handler.mjs'
import { writeFileIfContainsChanges } from '../utils/file.utils.mjs'
import { prettify } from '../utils/generator.utils.mjs'

const getReactUtils = ({ utilFileName, typesFileName, banner }: GeneratorConfigWithDefaultValues) => {
	return `${OVERRIDE_WARNING}${tsCheck}
${banner}

${jsDocImports(
	{
		from: 'typesafe-i18n/react',
		type: 'ReactInit<Locales, Translations, TranslationFunctions>',
		alias: 'ReactInit',
	},
	{
		from: 'typesafe-i18n/react',
		type: 'I18nContextType<Locales, Translations, TranslationFunctions>',
		alias: 'I18nContextType',
	},
	{ from: relativeFileImportPath(typesFileName), type: 'Formatters' },
	{ from: relativeFileImportPath(typesFileName), type: 'Locales' },
	{ from: relativeFileImportPath(typesFileName), type: 'TranslationFunctions' },
	{ from: relativeFileImportPath(typesFileName), type: 'Translations' },
)}

import { useContext } from 'react'
import { initI18nReact } from 'typesafe-i18n/react'
${importTypes('typesafe-i18n/react', 'I18nContextType')}
${importTypes(relativeFileImportPath(typesFileName), 'Formatters', 'Locales', 'TranslationFunctions', 'Translations')}
import { loadedFormatters, loadedLocales } from '${relativeFileImportPath(utilFileName)}'

${jsDocType('ReactInit')}
const { component: TypesafeI18n, context: I18nContext } = initI18nReact${generics(
		'Locales',
		'Translations',
		'TranslationFunctions',
		'Formatters',
	)}(loadedLocales, loadedFormatters)

${jsDocType('() => I18nContextType')}
const useI18nContext = ()${type(
		'I18nContextType<Locales, Translations, TranslationFunctions>',
	)} => useContext(I18nContext)

export { I18nContext, useI18nContext }

export default TypesafeI18n
`
}

export const generateReactAdapter = async (config: GeneratorConfigWithDefaultValues): Promise<void> => {
	const { outputPath } = config

	const reactUtils = getReactUtils(config)

	const fileName = config.adapterFileName || 'i18n-react'
	await writeFileIfContainsChanges(outputPath, `${fileName}${fileEnding}x`, prettify(reactUtils))
}
