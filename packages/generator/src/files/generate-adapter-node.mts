import type { GeneratorConfigWithDefaultValues } from '../../../config/src/types.mjs'
import { importTypes, OVERRIDE_WARNING, relativeFileImportPath, tsCheck, type } from '../output-handler.mjs'
import { writeFileIfContainsChanges } from '../utils/file.utils.mjs'
import { prettify } from '../utils/generator.utils.mjs'

const getNodeUtils = ({ utilFileName, banner, typesFileName }: GeneratorConfigWithDefaultValues) => {
	return `${OVERRIDE_WARNING}${tsCheck}
${banner}

import { i18n } from '${relativeFileImportPath(utilFileName)}'
import { loadAllLocales } from '${relativeFileImportPath(`${utilFileName}.sync`)}'
${importTypes('typesafe-i18n', 'LocaleTranslationFunctions')}
${importTypes(relativeFileImportPath(typesFileName), 'Locales', 'Translations', 'TranslationFunctions')}

loadAllLocales()

export const L${type('LocaleTranslationFunctions<Locales, Translations, TranslationFunctions>')} = i18n()

export default L
`
}

export const generateNodeAdapter = async (config: GeneratorConfigWithDefaultValues): Promise<void> => {
	const { outputPath } = config

	const nodeUtils = getNodeUtils(config)

	const fileName = config.adapterFileName || 'i18n-node'
	await writeFileIfContainsChanges(outputPath, fileName, prettify(nodeUtils))
}
