import { writeFileIfContainsChanges } from '../file-utils'
import { GeneratorConfigWithDefaultValues } from '../generate-files'
import { prettify } from '../generator-util'
import { importTypes, OVERRIDE_WARNING, tsCheck, type } from '../output-handler'

const getSvelteUtils = (
	{ baseLocale, formattersTemplateFileName, typesFileName, utilFileName, banner }: GeneratorConfigWithDefaultValues,
) => {
	return `${OVERRIDE_WARNING}${tsCheck}
${banner}

import { getI18nSvelteStore } from 'typesafe-i18n/adapters/adapter-svelte';
${importTypes(`./${typesFileName}`, 'Locales', 'Translation', 'TranslationFunctions', 'Formatters')}
import { getTranslationForLocale } from './${utilFileName}'
import { initFormatters } from './${formattersTemplateFileName}'

const { initI18n: init, setLocale, isLoadingLocale, locale, LL } = getI18nSvelteStore<Locales, Translation, TranslationFunctions, Formatters>()

const initI18n = (locale${type('Locales')} = '${baseLocale}') => init(locale, getTranslationForLocale, initFormatters)

export { initI18n, setLocale, isLoadingLocale, locale, LL }

export default LL
`
}

export const generateSvelteAdapter = async (
	config: GeneratorConfigWithDefaultValues,
): Promise<void> => {
	const { outputPath } = config

	const svelteUtils = getSvelteUtils(config)

	const fileName = config.adapterFileName || 'i18n-svelte'
	await writeFileIfContainsChanges(outputPath, fileName, prettify(svelteUtils))
}
