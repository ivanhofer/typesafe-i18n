import { join } from 'path'
import type { GeneratorConfigWithDefaultValues } from '../../../config/src/types'
import type { BaseTranslation, Locale } from '../../../runtime/src/core'
import { fileEnding } from '../output-handler'
import { getDictionaryTemplate } from '../utils/dictionary.utils'
import { writeFileIfContainsChanges } from '../utils/file.utils'
import { prettify } from '../utils/generator.utils'

// --------------------------------------------------------------------------------------------------------------------

export const generateLocaleTemplate = async (
	config: GeneratorConfigWithDefaultValues,
	locale: Locale,
	translations: BaseTranslation | BaseTranslation[] | undefined = undefined,
	editHint = '',
	showBanner = false,
): Promise<void> => {
	const { outputPath, baseLocale } = config

	const isBaseLocale = baseLocale === locale

	const localeTemplate = getDictionaryTemplate(
		config,
		locale,
		undefined,
		isBaseLocale,
		translations,
		editHint,
		showBanner,
	)

	await writeFileIfContainsChanges(join(outputPath, locale), `index${fileEnding}`, prettify(localeTemplate))
}
