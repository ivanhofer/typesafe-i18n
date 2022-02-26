import { join } from 'path'
import type { GeneratorConfigWithDefaultValues } from '../../../config/src/types'
import type { BaseTranslation, Locale } from '../../../runtime/src/core'
import { fileEnding } from '../output-handler'
import { getDictionaryTemplate } from '../utils/dictionary.utils'
import { writeFileIfContainsChanges } from '../utils/file.utils'
import { prettify } from '../utils/generator.utils'
import { logger } from '../utils/logger'

export const generateNamespaceTemplate = async (
	config: GeneratorConfigWithDefaultValues,
	locale: Locale,
	namespace: string,
	translations: BaseTranslation | BaseTranslation[] | undefined = undefined,
	editHint = '',
	showBanner = false,
): Promise<void> => {
	const { outputPath, baseLocale } = config

	const isBaseLocale = baseLocale === locale

	const localeTemplate = getDictionaryTemplate(
		config,
		locale,
		namespace,
		isBaseLocale,
		translations,
		editHint,
		showBanner,
	)

	logger.info(`creating boilerplate for locale '${locale}' and namespace '${namespace}'`)

	await writeFileIfContainsChanges(join(outputPath, locale, namespace), `index${fileEnding}`, prettify(localeTemplate))
}
