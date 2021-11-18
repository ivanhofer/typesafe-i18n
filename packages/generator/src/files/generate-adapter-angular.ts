import type { GeneratorConfigWithDefaultValues } from '../../../config/src/types'
import { writeFileIfContainsChanges } from '../file-utils'
import { prettify } from '../generator-util'
import { importTypes, OVERRIDE_WARNING, relativeFileImportPath, tsCheck } from '../output-handler'

const getAngularUtils = ({
	utilFileName,
	formattersTemplateFileName,
	banner,
	typesFileName,
}: GeneratorConfigWithDefaultValues) => {
	return `${OVERRIDE_WARNING}${tsCheck}
${banner}

import { Injectable } from '@angular/core'
import { I18nServiceRoot } from 'typesafe-i18n/angular/angular-service'
import { initFormatters } from '${relativeFileImportPath(formattersTemplateFileName)}'
${importTypes(relativeFileImportPath(typesFileName), 'Locales', 'Translation', 'TranslationFunctions', 'Formatters')}
import { baseLocale, getTranslationForLocale } from '${relativeFileImportPath(utilFileName)}'

@Injectable({
	providedIn: 'root',
})
export class I18nService extends I18nServiceRoot<Locales, Translation, TranslationFunctions, Formatters> {
	constructor() {
		super(baseLocale, getTranslationForLocale, initFormatters)
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
