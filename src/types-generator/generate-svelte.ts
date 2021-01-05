import { isBoolean } from 'typesafe-utils'
import { SVELTE_FILE } from '../constants/constants'
import { writeFileIfContainsChanges } from './file-utils'

const getSvelteStore = (baseLocale: string) => {
	return `// This types were auto-generated. Any manual changes will be overwritten.
/* eslint-disable */

import { langauge } from 'langauge';
import { derived, Writable, writable } from 'svelte/store';
import type { LangaugeLocales, LangaugeTranslation, LangaugeTranslationArgs } from './langauge-types'
import { localeTranslations } from './langauge-util'
import { initConfig } from './config'

const currentLocale = writable<LangaugeLocales>('${baseLocale}')

export const setLocale = (locale: LangaugeLocales) => currentLocale.set(locale)

export const selectedLocale = derived<Writable<LangaugeLocales>, LangaugeLocales>(currentLocale, (locale) => locale)

export const LLL = derived<Writable<LangaugeLocales>, LangaugeTranslationArgs>(currentLocale, (locale: LangaugeLocales, set: (value: LangaugeTranslationArgs) => void) => {
	const langaugeTranslation: LangaugeTranslation = localeTranslations[locale] as LangaugeTranslation
	const langaugeObject = langauge(langaugeTranslation, initConfig(locale))
	set(langaugeObject)
}, new Proxy({} as LangaugeTranslationArgs, { get: () => () => '' }))

export default LLL
`
}

export const generateSvelte = async (
	outputPath: string,
	svelteFile: boolean | string,
	baseLocale: string,
): Promise<void> => {
	const svelte = getSvelteStore(baseLocale)

	const path = isBoolean(svelteFile) ? SVELTE_FILE : svelteFile
	await writeFileIfContainsChanges(outputPath, path, svelte)
}
