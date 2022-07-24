import type { GeneratorConfigWithDefaultValues } from '../../../config/src/types.mjs'
import {
	generics,
	importTypes,
	jsDocImports,
	jsDocType,
	OVERRIDE_WARNING,
	relativeFileImportPath,
	tsCheck,
} from '../output-handler.mjs'
import { writeFileIfContainsChanges } from '../utils/file.utils.mjs'
import { prettify } from '../utils/generator.utils.mjs'

const getVueUtils = ({ typesFileName, utilFileName, banner }: GeneratorConfigWithDefaultValues) => {
	return `${OVERRIDE_WARNING}${tsCheck}
${banner}

${jsDocImports(
	{
		from: 'typesafe-i18n/vue',
		type: 'VuePluginInit<Locales, Translations, TranslationFunctions>',
		alias: 'VuePluginInit',
	},
	{ from: relativeFileImportPath(typesFileName), type: 'Formatters' },
	{ from: relativeFileImportPath(typesFileName), type: 'Locales' },
	{ from: relativeFileImportPath(typesFileName), type: 'TranslationFunctions' },
	{ from: relativeFileImportPath(typesFileName), type: 'Translations' },
)}

import { inject, ref } from 'vue'
import { initI18nVuePlugin } from 'typesafe-i18n/vue';
${importTypes(relativeFileImportPath(typesFileName), 'Formatters', 'Locales', 'TranslationFunctions', 'Translations')}
import { loadedFormatters, loadedLocales } from '${relativeFileImportPath(utilFileName)}'

${jsDocType('VuePluginInit')}
const { typesafeI18n, i18nPlugin } = initI18nVuePlugin${generics(
		'Locales',
		'Translations',
		'TranslationFunctions',
		'Formatters',
	)}(inject, ref, loadedLocales, loadedFormatters)

export { typesafeI18n, i18nPlugin }
`
}

export const generateVueAdapter = async (config: GeneratorConfigWithDefaultValues): Promise<void> => {
	const { outputPath } = config

	const vueUtils = getVueUtils(config)

	const fileName = config.adapterFileName || 'i18n-vue'
	await writeFileIfContainsChanges(outputPath, fileName, prettify(vueUtils))
}
