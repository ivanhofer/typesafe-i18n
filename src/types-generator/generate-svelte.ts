/* eslint-disable prettier/prettier */

import { isBoolean } from 'typesafe-utils'
import { SVELTE_FILENAME } from '../constants/constants'
import { writeFileIfContainsChanges } from './file-utils'
import { GeneratorConfigWithDefaultValues } from './generator'

const getSvelteStore = ({ lazyLoad, baseLocale, formattersTemplateFileName: formattersTemplatePath, typesFileName: typesFile, utilFileName: utilFile }: GeneratorConfigWithDefaultValues) => {
	return `// This types were auto-generated. Any manual changes will be overwritten.
/* eslint-disable */

import { langauge } from 'langauge';
import type { Writable } from 'svelte/store';
import { derived, writable } from 'svelte/store';
import type { LangaugeLocale, LangaugeTranslation, LangaugeTranslationArgs, LangaugeTranslationKeys } from './${typesFile}'
import { getTranslationFromLocale } from './${utilFile}'
import { initFormatters } from './${formattersTemplatePath}'

const currentLocale = writable<LangaugeLocale>(null)

const isLoading = writable<boolean>(true)

export let LLLL = new Proxy({} as LangaugeTranslationArgs, { get: (_target, key: LangaugeTranslationKeys) => () => key as string })

const langaugeInstance = writable<LangaugeTranslationArgs>(LLLL)
${lazyLoad
			? `
const setLangaugeInstance = async (locale: LangaugeLocale) => {
	if (!locale) return

	const langaugeTranslation: LangaugeTranslation = await getTranslationFromLocale(locale)
	LLLL = langauge(locale, langaugeTranslation, initFormatters(locale))
	langaugeInstance.set(LLLL)
	isLoading.set(false)
}`
			: `
const setLangaugeInstance = (locale: LangaugeLocale) => {
	if (!locale) return

	const langaugeTranslation: LangaugeTranslation = getTranslationFromLocale(locale)
	LLLL = langauge(locale, langaugeTranslation, initFormatters(locale))
	langaugeInstance.set(LLLL)
	isLoading.set(false)
}`}

export const init = (locale: LangaugeLocale = '${baseLocale}') => setLocale(locale)
${lazyLoad
			? `
export const setLocale = async (locale: LangaugeLocale) => {
	isLoading.set(true)
	currentLocale.set(locale)
	await setLangaugeInstance(locale)
}` : `
export const setLocale = (locale: LangaugeLocale) => {
	isLoading.set(true)
	currentLocale.set(locale)
	setLangaugeInstance(locale)
}`}

export const selectedLocale = derived<Writable<LangaugeLocale>, LangaugeLocale>(currentLocale, (locale) => locale)

export const localeLoading = derived<Writable<boolean>, boolean>(isLoading, (loading: boolean, set: (value: boolean) => void) => set(loading))

export const LLL = derived<Writable<LangaugeTranslationArgs>, LangaugeTranslationArgs>(langaugeInstance, (instance, set) => set(instance), LLLL)

export default LLL
`
}

export const generateSvelte = async (config: GeneratorConfigWithDefaultValues): Promise<void> => {
	const { outputPath, svelte } = config

	const svelteStore = getSvelteStore(config)

	const path = (!isBoolean(svelte) && svelte) || SVELTE_FILENAME
	await writeFileIfContainsChanges(outputPath, path, svelteStore)
}
