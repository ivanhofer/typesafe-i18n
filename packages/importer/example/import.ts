import type { BaseTranslation } from 'typesafe-i18n'
import { storeTranslationToDisk, type ImportLocaleMapping } from 'typesafe-i18n/importer'
import type { Locales } from "./src/i18n/i18n-types"

const getDataFromAPI = async (_locale: Locales): Promise<BaseTranslation> => {
	// custom implementation to fetch the data from a service

	return {
		HI: 'Hi {name:string}! Please leave a star if you like this project: https://github.com/ivanhofer/typesafe-i18n',
		importer: 'This example demonstrates the importer functionality',
		'my-namespace': {
			i: {
				am: {
					inside: {
						a: {
							namespace: 'I am a nested translation located inside a namespace',
						},
					},
				},
			},
		}
	}
}

const importTranslationsForLocale = async (locale: Locales) => {
	const translations = await getDataFromAPI(locale)

	const localeMapping: ImportLocaleMapping = {
		locale,
		translations,
		namespaces: ['my-namespace']
	}

	const result = await storeTranslationToDisk(localeMapping)

	console.log(`translations imported for locale '${result}'`)
}

importTranslationsForLocale('en')
