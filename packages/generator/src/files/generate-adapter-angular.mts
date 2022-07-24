import type { GeneratorConfigWithDefaultValues } from '@typesafe-i18n/config/types.mjs'
import { importTypes, OVERRIDE_WARNING, relativeFileImportPath, tsCheck } from '../output-handler.mjs'
import { writeFileIfContainsChanges } from '../utils/file.utils.mjs'
import { prettify } from '../utils/generator.utils.mjs'

const getAngularUtils = ({ utilFileName, banner, typesFileName }: GeneratorConfigWithDefaultValues) => {
	return `${OVERRIDE_WARNING}${tsCheck}
${banner}

import { Injectable } from '@angular/core'
import { I18nServiceRoot } from 'typesafe-i18n/angular'
${importTypes(relativeFileImportPath(typesFileName), 'Formatters', 'Locales', 'TranslationFunctions', 'Translations')}
import { loadedFormatters, loadedLocales } from '${relativeFileImportPath(utilFileName)}'

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
