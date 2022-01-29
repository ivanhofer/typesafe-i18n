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

const getVueUtils = ({ typesFileName, utilFileName, banner }: GeneratorConfigWithDefaultValues) => {
	return `${OVERRIDE_WARNING}${tsCheck}
${banner}

${jsDocImports(
	{
		from: 'typesafe-i18n/adapters/adapter-vue',
		type: 'VuePluginInit<Locales, Translation, TranslationFunctions>',
		alias: 'VuePluginInit',
	},
	{ from: relativeFileImportPath(typesFileName), type: 'Locales' },
	{ from: relativeFileImportPath(typesFileName), type: 'Translation' },
	{ from: relativeFileImportPath(typesFileName), type: 'TranslationFunctions' },
	{ from: relativeFileImportPath(typesFileName), type: 'Formatters' },
)}

import { inject, ref } from 'vue'
import { initI18nVuePlugin } from 'typesafe-i18n/adapters/adapter-vue';
${importTypes(relativeFileImportPath(typesFileName), 'Locales', 'Translation', 'TranslationFunctions', 'Formatters')}
import { typesafeI18n, i18nPlugin } from '${relativeFileImportPath(utilFileName)}'

${jsDocType('VuePluginInit')}
const { typesafeI18n, i18nPlugin } = initI18nVuePlugin${generics(
		'Locales',
		'Translation',
		'TranslationFunctions',
		'Formatters',
	)}(inject, ref, translations, formatters)

export { typesafeI18n, i18nPlugin }
`
}

export const generateVueAdapter = async (config: GeneratorConfigWithDefaultValues): Promise<void> => {
	const { outputPath } = config

	const vueUtils = getVueUtils(config)

	const fileName = config.adapterFileName || 'i18n-vue'
	await writeFileIfContainsChanges(outputPath, fileName, prettify(vueUtils))
}
