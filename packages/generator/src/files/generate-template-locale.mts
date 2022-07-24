import { join } from 'path'
import type { GeneratorConfigWithDefaultValues } from '../../../config/src/types.mjs'
import type { BaseTranslation, Locale } from '../../../runtime/src/core.mjs'
import { fileEnding } from '../output-handler.mjs'
import { getDictionaryTemplate } from '../utils/dictionary.utils.mjs'
import { writeFileIfContainsChanges } from '../utils/file.utils.mjs'
import { prettify } from '../utils/generator.utils.mjs'

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
