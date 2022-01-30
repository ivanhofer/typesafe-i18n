import type { GeneratorConfigWithDefaultValues } from '../../../config/src/types'
import type { Locale } from '../../../runtime/src/core'
import { writeFileIfContainsChanges } from '../file-utils'
import { prettify, sanitizeLocale } from '../generator-util'
import {
	importTypes,
	jsDocFunction,
	jsDocImports,
	OVERRIDE_WARNING,
	relativeFileImportPath,
	relativeFolderImportPath,
	tsCheck,
	type,
	typeCast,
} from '../output-handler'

const getLocalesTranslationRowAsync = (locale: Locale): string => {
	const sanitizedLocale = sanitizeLocale(locale)
	const needsEscaping = locale !== sanitizedLocale

	const wrappedLocale = needsEscaping ? `'${locale}'` : locale

	return `
	${wrappedLocale}: () => import('${relativeFolderImportPath(locale)}'),`
}

const getAsyncCode = (
	{ utilFileName, formattersTemplateFileName, typesFileName, banner }: GeneratorConfigWithDefaultValues,
	locales: Locale[],
) => {
	const localesTranslationLoaders = locales.map(getLocalesTranslationRowAsync).join('')

	return `${OVERRIDE_WARNING}${tsCheck}
${banner}

${jsDocImports(
	{ from: relativeFileImportPath(typesFileName), type: 'Locales' },
	{ from: relativeFileImportPath(typesFileName), type: 'Translation' },
)}

import { initFormatters } from './${formattersTemplateFileName}'
${importTypes(relativeFileImportPath(typesFileName), 'Locales', 'Translation')}
import { loadedFormatters, loadedLocales, locales } from './${utilFileName}'

const localeTranslationLoaders = {${localesTranslationLoaders}
}

${jsDocFunction('Promise<Translation>', { type: 'Locales', name: 'locale' })}
export const loadLocaleAsync = async (locale${type('Locales')}) => {
	if (loadedLocales[locale]) return

	loadedLocales[locale] = (await (localeTranslationLoaders[locale])()).default${typeCast('Translation')}
	loadFormatters(locale)
}

export const loadAllLocalesAsync = () => Promise.all(locales.map(loadLocaleAsync))

export const loadFormatters = (locale${type('Locales')}) =>
	loadedFormatters[locale] = initFormatters(locale)
`
}

export const generateAsyncUtil = async (config: GeneratorConfigWithDefaultValues, locales: Locale[]): Promise<void> => {
	const { outputPath, utilFileName } = config

	const asyncCode = getAsyncCode(config, locales)
	await writeFileIfContainsChanges(outputPath, `${utilFileName}.async`, prettify(asyncCode))
}
