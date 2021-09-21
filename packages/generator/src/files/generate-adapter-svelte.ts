import { writeFileIfContainsChanges } from '../file-utils'
import { GeneratorConfigWithDefaultValues } from '../generate-files'
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
	type
} from '../output-handler'

const getSvelteUtils = ({
	baseLocale,
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
	{ from: `./${typesFileName}`, type: 'Locales' },
	{ from: `./${typesFileName}`, type: 'Translation' },
	{ from: `./${typesFileName}`, type: 'TranslationFunctions' },
	{ from: `./${typesFileName}`, type: 'Formatters' },
)}

import { getI18nSvelteStore } from 'typesafe-i18n/adapters/adapter-svelte';
${importTypes(`./${typesFileName}`, 'Locales', 'Translation', 'TranslationFunctions', 'Formatters')}
import { getTranslationForLocale } from '${relativeFileImportPath(utilFileName)}'
import { initFormatters } from '${relativeFileImportPath(formattersTemplateFileName)}'

${jsDocType('SvelteStoreInit')}
const { initI18n: init, setLocale, isLoadingLocale, locale, LL } = getI18nSvelteStore${generics(
		'Locales',
		'Translation',
		'TranslationFunctions',
		'Formatters',
	)}()

${jsDocFunction('Promise<void>', { type: 'Locales', name: 'locale' })}
const initI18n = (locale${type('Locales')} = '${baseLocale}') => init(locale, getTranslationForLocale, initFormatters)

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
