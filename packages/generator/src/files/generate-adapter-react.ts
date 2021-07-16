import { writeFileIfContainsChanges } from '../file-utils'
import { GeneratorConfigWithDefaultValues } from '../generate-files'
import { prettify } from '../generator-util'
import { generics, importTypes, jsDocImports, jsDocType, OVERRIDE_WARNING, tsCheck } from '../output-handler'

const getReactUtils = ({ utilFileName, typesFileName, formattersTemplateFileName, banner }: GeneratorConfigWithDefaultValues) => {
	return `${OVERRIDE_WARNING}${tsCheck}
${banner}

${jsDocImports(
		{ from: 'react', type: 'FunctionComponent', alias: 'ReactFunctionComponent' },
		{ from: 'react', type: 'Context<I18nContextType>', alias: 'ReactContext' },
		{ from: 'typesafe-i18n/adapters/adapter-react', type: 'TypesafeI18nProps<Locales>', alias: 'TypesafeI18nProps' },
		{ from: 'typesafe-i18n/adapters/adapter-react', type: 'I18nContextType<Locales, Translation, TranslationFunctions>', alias: 'I18nContextType' },
		{ from: `./${typesFileName}`, type: 'Locales' },
		{ from: `./${typesFileName}`, type: 'Translation' },
		{ from: `./${typesFileName}`, type: 'TranslationFunctions' },
		{ from: `./${typesFileName}`, type: 'Formatters' },
	)}

import { initI18nReact } from 'typesafe-i18n/adapters/adapter-react'
${importTypes(`./${typesFileName}`, 'Locales', 'Translation', 'TranslationFunctions', 'Formatters')}
import { baseLocale, getTranslationForLocale } from './${utilFileName}'
import { initFormatters } from './${formattersTemplateFileName}'

${jsDocType('{ component: React.FunctionComponent<TypesafeI18nProps>; context: React.Context<I18nContextType>}')}
const { component: TypesafeI18n, context: I18nContext } = initI18nReact${generics('Locales', 'Translation', 'TranslationFunctions', 'Formatters')}(baseLocale, getTranslationForLocale, initFormatters)

export { I18nContext }

export default TypesafeI18n
`
}

export const generateReactAdapter = async (
	config: GeneratorConfigWithDefaultValues,
): Promise<void> => {
	const { outputPath } = config

	const reactUtils = getReactUtils(config)

	const fileName = config.adapterFileName || 'i18n-react.tsx'
	await writeFileIfContainsChanges(outputPath, fileName, prettify(reactUtils))
}
