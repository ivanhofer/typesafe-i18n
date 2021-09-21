import { writeFileIfContainsChanges } from '../file-utils'
import { GeneratorConfigWithDefaultValues } from '../generate-files'
import { prettify } from '../generator-util'
import {
	fileEnding,
	generics,
	importTypes,
	jsDocImports,
	jsDocType,
	OVERRIDE_WARNING,
	relativeFileImportPath,
	tsCheck
} from '../output-handler'

const getReactUtils = ({
	utilFileName,
	typesFileName,
	formattersTemplateFileName,
	banner,
}: GeneratorConfigWithDefaultValues) => {
	return `${OVERRIDE_WARNING}${tsCheck}
${banner}

${jsDocImports(
	{
		from: 'typesafe-i18n/adapters/adapter-react',
		type: 'ReactInit<Locales, Translation, TranslationFunctions>',
		alias: 'ReactInit',
	},
	{ from: `./${typesFileName}`, type: 'Locales' },
	{ from: `./${typesFileName}`, type: 'Translation' },
	{ from: `./${typesFileName}`, type: 'TranslationFunctions' },
	{ from: `./${typesFileName}`, type: 'Formatters' },
)}

import { initI18nReact } from 'typesafe-i18n/adapters/adapter-react'
${importTypes(`./${typesFileName}`, 'Locales', 'Translation', 'TranslationFunctions', 'Formatters')}
import { baseLocale, getTranslationForLocale } from '${relativeFileImportPath(utilFileName)}'
import { initFormatters } from '${relativeFileImportPath(formattersTemplateFileName)}'

${jsDocType('ReactInit')}
const { component: TypesafeI18n, context: I18nContext } = initI18nReact${generics(
		'Locales',
		'Translation',
		'TranslationFunctions',
		'Formatters',
	)}(baseLocale, getTranslationForLocale, initFormatters)

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
