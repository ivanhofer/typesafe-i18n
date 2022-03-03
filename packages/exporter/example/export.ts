import { readTranslationFromDisk, type ExportLocaleMapping } from 'typesafe-i18n/exporter'
import { inspect } from 'util'

const sendDataToAPI = async (exportMapping: ExportLocaleMapping) => {
	// custom implementation to store the data to a service

	console.log(inspect(exportMapping, false, 999, true))
}

const exportTranslationsForLocale = async (locale: string) => {
	const mapping = await readTranslationFromDisk(locale)

	await sendDataToAPI(mapping)
}

exportTranslationsForLocale('en')
