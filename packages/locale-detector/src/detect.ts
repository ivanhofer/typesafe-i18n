import { Locale } from 'packages/core/src/core'
import { isTruthy } from 'typesafe-utils'

export type LocaleDetector = () => Locale[]

export const detectLocale = (baseLocale: Locale, availableLocales: Locale[], ...detectors: LocaleDetector[]): Locale =>
	detectors.reduce<Locale | undefined>(
		(prev, detector) => prev || findMatchingLocale(availableLocales, detector),
		'',
	) || baseLocale

const findMatchingLocale = (availableLocales: Locale[], detector: LocaleDetector): Locale | undefined => {
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
