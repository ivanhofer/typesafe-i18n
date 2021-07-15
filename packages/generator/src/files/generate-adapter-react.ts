import { writeFileIfContainsChanges } from '../file-utils'
import { GeneratorConfigWithDefaultValues } from '../generate-files'
import { prettify } from '../generator-util'
import { generics, importTypes, OVERRIDE_WARNING, tsCheck } from '../output-handler'

const getReactUtils = ({ utilFileName, typesFileName, formattersTemplateFileName, banner }: GeneratorConfigWithDefaultValues) => {
	return `${OVERRIDE_WARNING}${tsCheck}
${banner}

import { initI18nReact } from 'typesafe-i18n/adapters/adapter-react'
${importTypes(`./${typesFileName}`, 'Locales', 'Translation', 'TranslationFunctions', 'Formatters')}
import { baseLocale, getTranslationForLocale } from './${utilFileName}'
import { initFormatters } from './${formattersTemplateFileName}'

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
