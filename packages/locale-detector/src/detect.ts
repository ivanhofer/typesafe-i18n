import { Locale } from 'packages/core/src/core'

export type LocaleDetector = () => Locale[]

export const detectLocale = (
	baseLocale: Locale,
	availableLocales: Locale[],
	...detectors: LocaleDetector[]
): Locale => {
	const lowercasedLocales = availableLocales.map((locale) => locale.toLowerCase())
	return (
		detectors.reduce<Locale | undefined>(
			(prev, detector) => prev || findMatchingLocale(lowercasedLocales, detector),
			'',
		) || baseLocale
	)
}

const findMatchingLocale = (availableLocales: Locale[], detector: LocaleDetector): Locale | undefined => {
	const detectedLocales = detector().map((locale) => locale.toLowerCase())
	const localesToMatch = [
		...detectedLocales,
		// also include locles without country code e.g. if only 'en-US' is detected, we should also look for 'en'
		...(detectedLocales
			.filter((locale) => locale.includes('-'))
			.flatMap((locale) => locale.split('-')[0]) as Locale[]),
	]

	return localesToMatch.find((locale) => availableLocales.includes(locale))
}
