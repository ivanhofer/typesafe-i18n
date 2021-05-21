import { Locale } from '../../core/src/core'
import { isTruthy } from 'typesafe-utils'

export type LocaleDetector = () => string[]

export const detectLocale = <L extends Locale>(
	baseLocale: L,
	availableLocales: L[],
	...detectors: LocaleDetector[]
): L =>
	detectors.reduce<L | undefined>(
		(prev, detector) => prev || findMatchingLocale<L>(availableLocales, detector),
		'' as L,
	) || baseLocale

const findMatchingLocale = <L extends Locale>(availableLocales: L[], detector: LocaleDetector): L | undefined => {
	const detectedLocales = detector().map((locale) => locale.toLowerCase())
	// also include locles without country code e.g. if only 'en-US' is detected, we should also look for 'en'
	const localesToMatch = Array.from(new Set(detectedLocales.flatMap((locale) => [locale, locale.split('-')[0]])))

	const lowercasedLocales = availableLocales.map((locale) => locale.toLowerCase())

	return localesToMatch
		.map((locale) => {
			const matchedIndex = lowercasedLocales.findIndex((l) => l === locale)
			return matchedIndex >= 0 && availableLocales[matchedIndex]
		})
		.find(isTruthy)
}
