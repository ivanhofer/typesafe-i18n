import { isTruthy, uniqueArray } from 'typesafe-utils'
import type { Locale } from '../../runtime/src/core.mjs'

export type LocaleDetector = () => string[]

export const detectLocale = <L extends Locale>(
	baseLocale: L,
	availableLocales: L[],
	...detectors: LocaleDetector[]
): L => {
	for (const detector of detectors) {
		const found = findMatchingLocale<L>(availableLocales, detector)
		if (found) return found
	}

	return baseLocale
}

const findMatchingLocale = <L extends Locale>(availableLocales: L[], detector: LocaleDetector): L | undefined => {
	const detectedLocales = detector().map((locale) => locale.toLowerCase())
	// also include locales without country code e.g. if only 'en-US' is detected, we should also look for 'en'
	const localesToMatch = uniqueArray(detectedLocales.flatMap((locale) => [locale, locale.split('-')[0]]))

	const lowercasedLocales = availableLocales.map((locale) => locale.toLowerCase())

	return localesToMatch
		.map((locale) => {
			const matchedIndex = lowercasedLocales.findIndex((l) => l === locale)
			return matchedIndex >= 0 && availableLocales[matchedIndex]
		})
		.find(isTruthy)
}
