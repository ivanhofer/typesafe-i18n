/* eslint-disable prettier/prettier */

import { isBoolean } from 'typesafe-utils'
import { SVELTE_FILE } from '../constants/constants'
import { writeFileIfContainsChanges } from './file-utils'
import { GeneratorConfigWithDefaultValues } from './generator'

const getSvelteStore = (lazyLoad: boolean, baseLocale: string) => {
	return `// This types were auto-generated. Any manual changes will be overwritten.
/* eslint-disable */

import { langauge } from 'langauge';
import { derived, Writable, writable } from 'svelte/store';
import type { LangaugeLocales, LangaugeTranslation, LangaugeTranslationArgs } from './langauge-types'
${lazyLoad
			? `import { loadLocaleTranslations } from './langauge-util'`
			: `import { getLocaleTranslations } from './langauge-util'`
		}

import { initFormatters } from './formatters'

const currentLocale = writable<LangaugeLocales>(null)

const isLoading = writable<boolean>(true)

export const init = (locale: LangaugeLocales = '${baseLocale}') => setLocale(locale)

export const setLocale = (locale: LangaugeLocales) => {
	isLoading.set(true)
	currentLocale.set(locale)
}

export const selectedLocale = derived<Writable<LangaugeLocales>, LangaugeLocales>(currentLocale, (locale) => locale)

export const localeLoading = derived<Writable<boolean>, boolean>(isLoading, (loading) => loading)
${lazyLoad
			? `
export const LLL = derived<Writable<LangaugeLocales>, LangaugeTranslationArgs>(currentLocale, (locale: LangaugeLocales, set: (value: LangaugeTranslationArgs) => void) => {
	const setStoreValue = async () => {
		const langaugeTranslation: LangaugeTranslation = await loadLocaleTranslations(locale)
		const langaugeObject = langauge(locale, langaugeTranslation, initFormatters(locale))
		set(langaugeObject)
		isLoading.set(false)
	}

	setStoreValue()
}, new Proxy({} as LangaugeTranslationArgs, { get: () => () => '' }))`
			: `
export const LLL = derived<Writable<LangaugeLocales>, LangaugeTranslationArgs>(currentLocale, (locale: LangaugeLocales, set: (value: LangaugeTranslationArgs) => void) => {
	const langaugeTranslation: LangaugeTranslation = getLocaleTranslations(locale)
	const langaugeObject = langauge(locale, langaugeTranslation, initFormatters(locale))
	set(langaugeObject)
	isLoading.set(false)
}, new Proxy({} as LangaugeTranslationArgs, { get: () => () => '' }))`
		}

export default LLL
`
}

type GenerateSvelteType = Pick<GeneratorConfigWithDefaultValues, 'outputPath' | 'svelte' | 'baseLocale' | 'lazyLoad'>

export const generateSvelte = async ({
	outputPath,
	svelte,
	baseLocale,
	lazyLoad
}: GenerateSvelteType): Promise<void> => {
	const svelteStore = getSvelteStore(lazyLoad, baseLocale)

	const path = (!isBoolean(svelte) && svelte) || SVELTE_FILE
	await writeFileIfContainsChanges(outputPath, path, svelteStore)
}
