import { isBoolean } from 'typesafe-utils'
import { writeFileIfContainsChanges } from '../file-utils'
import { GeneratorConfigWithDefaultValues } from '../generator'

const getSvelteStore = (
	{
		baseLocale,
		formattersTemplateFileName: formattersTemplatePath,
		typesFileName: typesFile,
		utilFileName: utilFile,
	}: GeneratorConfigWithDefaultValues,
	importType: string,
) => {
	return `// This types were auto-generated. Any manual changes will be overwritten.
/* eslint-disable */

import { getI18nSvelteStore } from 'langauge';
import${importType} { Locales, Translation, TranslationFunctions, Formatters } from './${typesFile}'
import { getTranslationForLocale } from './${utilFile}'
import { initFormatters } from './${formattersTemplatePath}'

const { initI18n: init, setLocale, isLoadingLocale, locale, LL } = getI18nSvelteStore<Locales, Translation, TranslationFunctions, Formatters>()

const initI18n = (locale: Locales = '${baseLocale}') => init(locale, getTranslationForLocale, initFormatters)

export { initI18n, setLocale, isLoadingLocale, locale, LL }

export default LL
`
}

export const generateSvelte = async (config: GeneratorConfigWithDefaultValues, importType: string): Promise<void> => {
	const { outputPath, svelte } = config

	const svelteStore = getSvelteStore(config, importType)

	const path = (!isBoolean(svelte) && svelte) || 'langauge-svelte'
	await writeFileIfContainsChanges(outputPath, path, svelteStore)
}
