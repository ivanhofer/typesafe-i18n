import type { GeneratorConfigWithDefaultValues } from '../../config/src/types'
import { generateBaseLocaleTemplate, generateLocaleTemplate } from './files/generate-template-locale'

export const generateDictionaryFiles = async (
	config: GeneratorConfigWithDefaultValues = {} as GeneratorConfigWithDefaultValues,
	forceOverride: boolean,
) => {
	if (!forceOverride) {
		return
	}

	const dummyTranslations = {
		en: 'Hi {name}! Please leave a star if you like this project: https://github.com/ivanhofer/typesafe-i18n',
		de: 'Hallo {name}! Bitte hinterlasse einen Stern, wenn dir das Projekt gefällt: https://github.com/ivanhofer/typesafe-i18n',
	}

	const primaryLocale = config.baseLocale.startsWith('de') ? 'de' : 'en'
	const secondaryLocale = primaryLocale === 'de' ? 'en' : 'de'

	await generateBaseLocaleTemplate(
		config,
		{
			HI: dummyTranslations[primaryLocale].replace('{name}', '{name:string}'),
		},
		'TODO: your translations go here',
	)

	await generateLocaleTemplate(
		config,
		secondaryLocale,
		{
			HI: dummyTranslations[secondaryLocale],
		},
		'this is an example Translation, just rename or delete this folder if you want',
	)
}
