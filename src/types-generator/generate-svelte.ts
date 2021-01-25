/* eslint-disable prettier/prettier */

import { isBoolean } from 'typesafe-utils'
import { writeFileIfContainsChanges } from './file-utils'
import { GeneratorConfigWithDefaultValues } from './generator'

const getSvelteStore = ({ lazyLoad, baseLocale, formattersTemplateFileName: formattersTemplatePath, typesFileName: typesFile, utilFileName: utilFile }: GeneratorConfigWithDefaultValues) => {
	return `// This types were auto-generated. Any manual changes will be overwritten.
/* eslint-disable */

import { langauge } from 'langauge';
import type { Readable, Writable } from 'svelte/store';
import { derived, writable } from 'svelte/store';
import type { LangaugeLocale, LangaugeTranslation, LangaugeTranslationArgs, LangaugeTranslationKeys } from './${typesFile}'
import { getTranslationFromLocale } from './${utilFile}'
import { initFormatters } from './${formattersTemplatePath}'

const currentLocale = writable<LangaugeLocale>(null)

const isLoading = writable<boolean>(true)

let langaugeInstance = new Proxy({} as LangaugeTranslationArgs, { get: (_target, key: LangaugeTranslationKeys) => () => key as string })

const langaugeInstanceStore = writable<LangaugeTranslationArgs>(langaugeInstance)

export const init = (locale: LangaugeLocale = '${baseLocale}') => setLocale(locale)

export const setLocale = ${lazyLoad ? 'async ' : ''}(locale: LangaugeLocale) => {
	if (!locale) return

	isLoading.set(true)

	const langaugeTranslation: LangaugeTranslation = ${lazyLoad ? 'await ' : ''}getTranslationFromLocale(locale)
	langaugeInstance = langauge(locale, langaugeTranslation, initFormatters(locale))
	langaugeInstanceStore.set(langaugeInstance)

	currentLocale.set(locale)

	isLoading.set(false)
}

export const selectedLocale = derived<Writable<LangaugeLocale>, LangaugeLocale>(currentLocale, (locale) => locale)

export const localeLoading = derived<Writable<boolean>, boolean>(isLoading, (loading: boolean, set: (value: boolean) => void) => set(loading))

export const LLL = new Proxy({} as Readable<LangaugeTranslationArgs> & LangaugeTranslationArgs, {
	get: (_target, key: LangaugeTranslationKeys & 'subscribe') => key === 'subscribe'
		? langaugeInstanceStore.subscribe
		: langaugeInstance[key]
})

export default LLL
`
}

export const generateSvelte = async (config: GeneratorConfigWithDefaultValues): Promise<void> => {
	const { outputPath, svelte } = config

	const svelteStore = getSvelteStore(config)

	const path = (!isBoolean(svelte) && svelte) || 'langauge-svelte'
	await writeFileIfContainsChanges(outputPath, path, svelteStore)
}
