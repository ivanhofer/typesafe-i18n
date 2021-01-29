import { isBoolean } from 'typesafe-utils'
import { writeFileIfContainsChanges } from '../file-utils'
import { GeneratorConfigWithDefaultValues } from '../generator'

const getSvelteStore = (
	{
		lazyLoad,
		baseLocale,
		formattersTemplateFileName: formattersTemplatePath,
		typesFileName: typesFile,
		utilFileName: utilFile,
	}: GeneratorConfigWithDefaultValues,
	importType: string,
) => {
	return `// This types were auto-generated. Any manual changes will be overwritten.
/* eslint-disable */

import { langaugeObjectWrapper } from 'langauge';
import${importType} { Readable, Writable } from 'svelte/store';
import { derived, writable } from 'svelte/store';
import${importType} { LangaugeLocale, LangaugeTranslation, LangaugeTranslationArgs, LangaugeTranslationKeys } from './${typesFile}'
import { getTranslationForLocale } from './${utilFile}'
import { initFormatters } from './${formattersTemplatePath}'

const currentLocale = writable<LangaugeLocale>('' as LangaugeLocale)

const isLoading = writable<boolean>(true)

let langaugeInstance = new Proxy({} as LangaugeTranslationArgs, { get: (_target, key: LangaugeTranslationKeys) => () => key as string })

const langaugeInstanceStore = writable<LangaugeTranslationArgs>(langaugeInstance)

export const initLangauge = (newlocale: LangaugeLocale = '${baseLocale}') => setLocale(newlocale)

export const setLocale = ${lazyLoad ? 'async ' : ''}(newlocale: LangaugeLocale) => {
	if (!newlocale) return

	isLoading.set(true)

	const langaugeTranslation: LangaugeTranslation = ${lazyLoad ? 'await ' : ''}getTranslationForLocale(newlocale)
	langaugeInstance = langaugeObjectWrapper(newlocale, langaugeTranslation, initFormatters(newlocale))
	langaugeInstanceStore.set(langaugeInstance)

	currentLocale.set(newlocale)

	isLoading.set(false)
}

export const locale = derived<Writable<LangaugeLocale>, LangaugeLocale>(currentLocale, (newlocale) => newlocale)

export const isLoadingLocale = derived<Writable<boolean>, boolean>(isLoading, (loading: boolean, set: (value: boolean) => void) => set(loading))

export const LL = new Proxy({} as Readable<LangaugeTranslationArgs> & LangaugeTranslationArgs, {
	get: (_target, key: LangaugeTranslationKeys & 'subscribe') => key === 'subscribe'
		? langaugeInstanceStore.subscribe
		: langaugeInstance[key]
})

export default LL
`
}

export const generateSvelte = async (config: GeneratorConfigWithDefaultValues, importType: string): Promise<void> => {
	const { outputPath, svelte } = config

	const svelteStore = getSvelteStore(config, importType)

	const path = (!isBoolean(svelte) && svelte) || 'langauge-svelte'
	await writeFileIfContainsChanges(outputPath, path, svelteStore)
}
