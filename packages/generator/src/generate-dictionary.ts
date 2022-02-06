import { sync as glob } from 'glob'
import type { Locale } from 'packages/runtime/src/core'
import type { GeneratorConfigWithDefaultValues } from '../../config/src/types'
import { generateLocaleTemplate } from './files/generate-template-locale'
import { generateNamespaceTemplate } from './files/generate-template-namespace'

export const generateDictionaryFiles = async (
	config: GeneratorConfigWithDefaultValues = {} as GeneratorConfigWithDefaultValues,
	forceOverride: boolean,
) => {
	if (!forceOverride) return

	const dummyTranslations = {
		en: 'Hi {name}! Please leave a star if you like this project: https://github.com/ivanhofer/typesafe-i18n',
		de: 'Hallo {name}! Bitte hinterlasse einen Stern, wenn dir das Projekt gefällt: https://github.com/ivanhofer/typesafe-i18n',
	}

	const primaryLocale = config.baseLocale.startsWith('de') ? 'de' : 'en'
	const secondaryLocale = primaryLocale === 'de' ? 'en' : 'de'

	const promises: Promise<unknown>[] = []

	promises.push(
		generateLocaleTemplate(
			config,
			config.baseLocale,
			{
				HI: dummyTranslations[primaryLocale].replace('{name}', '{name:string}'),
			},
			'TODO: your translations go here',
		),
	)

	promises.push(
		generateLocaleTemplate(
			config,
			secondaryLocale,
			{
				HI: dummyTranslations[secondaryLocale],
			},
			'this is an example Translation, just rename or delete this folder if you want',
		),
	)

	await Promise.all(promises)
}

// --------------------------------------------------------------------------------------------------------------------

export const findAllNamespacesForLocale = (locale: Locale, outputPath: string): string[] =>
	glob(`${outputPath}/${locale}/*/index.*s`).map((file) => {
		// TODO: check if this split also works for windows-paths
		const parts = file.split('/')
		return parts[parts.length - 2] as string
	})

export const generateNamespaceFiles = async (
	config: GeneratorConfigWithDefaultValues,
	locales: Locale[] = [],
	namespaces: string[] = [],
	forceOverride: boolean,
): Promise<void> => {
	const localesToCheck = locales.filter((locale) => locale !== config.baseLocale)

	const promises: Promise<unknown>[] = []
	localesToCheck.forEach((locale) => {
		const foundNamespaces = findAllNamespacesForLocale(locale, config.outputPath)
		const missingNamespaces = namespaces.filter((namespace) => forceOverride || !foundNamespaces.includes(namespace))

		missingNamespaces.forEach((missingNamespace) =>
			promises.push(generateNamespaceTemplate(config, locale, missingNamespace)),
		)
	})

	await Promise.all(promises)
}
