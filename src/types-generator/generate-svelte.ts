/* eslint-disable prettier/prettier */

import { isBoolean } from 'typesafe-utils'
import { SVELTE_FILENAME } from '../constants/constants'
import { writeFileIfContainsChanges } from './file-utils'
import { GeneratorConfigWithDefaultValues } from './generator'

const getSvelteStore = ({ lazyLoad, baseLocale, formattersTemplateFileName: formattersTemplatePath, typesFileName: typesFile, utilFileName: utilFile }: GeneratorConfigWithDefaultValues) => {
	return `// This types were auto-generated. Any manual changes will be overwritten.
/* eslint-disable */

import { langauge } from 'langauge';
import { derived, Writable, writable } from 'svelte/store';
import type { LangaugeLocale, LangaugeTranslation, LangaugeTranslationArgs } from './${typesFile}'
import { getTranslationFromLocale } from './${utilFile}'
import { initFormatters } from './${formattersTemplatePath}'

const currentLocale = writable<LangaugeLocale>(null)

const isLoading = writable<boolean>(true)

export const init = (locale: LangaugeLocale = '${baseLocale}') => setLocale(locale)

export const setLocale = (locale: LangaugeLocale) => {
	isLoading.set(true)
	currentLocale.set(locale)
}

export const selectedLocale = derived<Writable<LangaugeLocale>, LangaugeLocale>(currentLocale, (locale) => locale)

export const localeLoading = derived<Writable<boolean>, boolean>(isLoading, (loading) => loading)
${lazyLoad
			? `
export const LLL = derived<Writable<LangaugeLocale>, LangaugeTranslationArgs>(currentLocale, (locale: LangaugeLocale, set: (value: LangaugeTranslationArgs) => void) => {
	const setStoreValue = async () => {
		const langaugeTranslation: LangaugeTranslation = await getTranslationFromLocale(locale)
		const langaugeObject = langauge(locale, langaugeTranslation, initFormatters(locale))
		set(langaugeObject)
		isLoading.set(false)
	}

	setStoreValue()
}, new Proxy({} as LangaugeTranslationArgs, { get: () => () => '' }))`
			: `
export const LLL = derived<Writable<LangaugeLocale>, LangaugeTranslationArgs>(currentLocale, (locale: LangaugeLocale, set: (value: LangaugeTranslationArgs) => void) => {
	const langaugeTranslation: LangaugeTranslation = getTranslationFromLocale(locale)
	const langaugeObject = langauge(locale, langaugeTranslation, initFormatters(locale))
	set(langaugeObject)
	isLoading.set(false)
}, new Proxy({} as LangaugeTranslationArgs, { get: () => () => '' }))`
		}

export default LLL
`
}

export const generateSvelte = async (config: GeneratorConfigWithDefaultValues): Promise<void> => {
	const { outputPath, svelte } = config

	const svelteStore = getSvelteStore(config)

	const path = (!isBoolean(svelte) && svelte) || SVELTE_FILENAME
	await writeFileIfContainsChanges(outputPath, path, svelteStore)
}
