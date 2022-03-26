import type { GeneratorConfigWithDefaultValues } from '../../../config/src/types'
import { importTypes, OVERRIDE_WARNING, relativeFileImportPath, tsCheck } from '../output-handler'
import { writeFileIfContainsChanges } from '../utils/file.utils'
import { prettify } from '../utils/generator.utils'

const getAngularUtils = ({ utilFileName, banner, typesFileName }: GeneratorConfigWithDefaultValues) => {
	return `${OVERRIDE_WARNING}${tsCheck}
${banner}

import { Injectable } from '@angular/core'
import { I18nServiceRoot } from 'typesafe-i18n/angular'
${importTypes(relativeFileImportPath(typesFileName), 'Locales', 'Translations', 'TranslationFunctions', 'Formatters')}
import { loadedLocales, loadedFormatters } from '${relativeFileImportPath(utilFileName)}'

@Injectable({
	providedIn: 'root',
})
export class I18nService extends I18nServiceRoot<Locales, Translations, TranslationFunctions, Formatters> {
	constructor() {
		super(loadedLocales, loadedFormatters)
	}
}
`
}

export const generateAngularAdapter = async (config: GeneratorConfigWithDefaultValues): Promise<void> => {
	const { outputPath } = config

	const nodeUtils = getAngularUtils(config)

	const fileName = config.adapterFileName || 'i18n.service'
	await writeFileIfContainsChanges(outputPath, fileName, prettify(nodeUtils))
}
