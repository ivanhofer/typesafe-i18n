import type { GeneratorConfigWithDefaultValues } from '../../../config/src/types'
import { writeFileIfContainsChanges } from '../file-utils'
import { prettify } from '../generator-util'
import {
	generics,
	importTypes,
	jsDocFunction,
	jsDocImports,
	jsDocType,
	OVERRIDE_WARNING,
	relativeFileImportPath,
	tsCheck,
	type,
} from '../output-handler'

const getSvelteUtils = ({
	formattersTemplateFileName,
	typesFileName,
	utilFileName,
	banner,
}: GeneratorConfigWithDefaultValues) => {
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

import { getI18nSvelteStore } from 'typesafe-i18n/adapters/adapter-svelte';
${importTypes(relativeFileImportPath(typesFileName), 'Locales', 'Translation', 'TranslationFunctions', 'Formatters')}
import { baseLocale, getTranslationForLocale } from '${relativeFileImportPath(utilFileName)}'
import { initFormatters } from '${relativeFileImportPath(formattersTemplateFileName)}'

${jsDocType('SvelteStoreInit')}
const { initI18n: init, setLocale, isLoadingLocale, locale, LL } = getI18nSvelteStore${generics(
		'Locales',
		'Translation',
		'TranslationFunctions',
		'Formatters',
	)}()

${jsDocFunction('Promise<void>', { type: 'Locales', name: 'locale' })}
const initI18n = (locale${type('Locales')} = baseLocale) => init(locale, getTranslationForLocale, initFormatters)

export { initI18n, setLocale, isLoadingLocale, locale, LL }

export default LL
`
}

export const generateSvelteAdapter = async (config: GeneratorConfigWithDefaultValues): Promise<void> => {
	const { outputPath } = config

	const svelteUtils = getSvelteUtils(config)

	const fileName = config.adapterFileName || 'i18n-svelte'
	await writeFileIfContainsChanges(outputPath, fileName, prettify(svelteUtils))
}
