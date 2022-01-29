import type { GeneratorConfigWithDefaultValues } from '../../../config/src/types'
import { writeFileIfContainsChanges } from '../file-utils'
import { prettify } from '../generator-util'
import {
	generics,
	importTypes,
	jsDocImports,
	jsDocType,
	OVERRIDE_WARNING,
	relativeFileImportPath,
	tsCheck,
} from '../output-handler'

const getSvelteUtils = ({ typesFileName, utilFileName, banner }: GeneratorConfigWithDefaultValues) => {
	return `${OVERRIDE_WARNING}${tsCheck}
${banner}

${jsDocImports(
	{
		from: 'typesafe-i18n/adapters/adapter-svelte',
		type: 'SvelteStoreInit<Locales, Translation, TranslationFunctions>',
		alias: 'SvelteStoreInit',
	},
	{ from: relativeFileImportPath(typesFileName), type: 'Locales' },
	{ from: relativeFileImportPath(typesFileName), type: 'Translation' },
	{ from: relativeFileImportPath(typesFileName), type: 'TranslationFunctions' },
	{ from: relativeFileImportPath(typesFileName), type: 'Formatters' },
)}

import { initI18nSvelte } from 'typesafe-i18n/adapters/adapter-svelte';
${importTypes(relativeFileImportPath(typesFileName), 'Locales', 'Translation', 'TranslationFunctions', 'Formatters')}
import { translations, formatters } from '${relativeFileImportPath(utilFileName)}'

${jsDocType('SvelteStoreInit')}
const { locale, LL, setLocale } = initI18nSvelte${generics(
		'Locales',
		'Translation',
		'TranslationFunctions',
		'Formatters',
	)}(translations, formatters)

export { locale, LL, setLocale }

export default LL
`
}

export const generateSvelteAdapter = async (config: GeneratorConfigWithDefaultValues): Promise<void> => {
	const { outputPath } = config

	const svelteUtils = getSvelteUtils(config)

	const fileName = config.adapterFileName || 'i18n-svelte'
	await writeFileIfContainsChanges(outputPath, fileName, prettify(svelteUtils))
}
