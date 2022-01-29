import type { Locale } from 'packages/runtime/src/core'
import type { GeneratorConfigWithDefaultValues } from '../../../config/src/types'
import { writeFileIfContainsChanges } from '../file-utils'
import { prettify, sanitizeLocale } from '../generator-util'
import {
	importTypes,
	jsDocImports,
	jsDocTsIgnore,
	OVERRIDE_WARNING,
	relativeFileImportPath,
	relativeFolderImportPath,
	tsCheck,
	typeCast,
} from '../output-handler'

const getLocalesTranslationRowSync = (locale: Locale, baseLocale: string): string => {
	const sanitizedLocale = sanitizeLocale(locale)
	const needsEscaping = locale !== sanitizedLocale

	const postfix = needsEscaping ? `: ${sanitizedLocale}` : ''

	const wrappedLocale = needsEscaping ? `'${locale}'` : locale

	return `${locale === baseLocale ? jsDocTsIgnore : ''}
	${wrappedLocale}${postfix},`
}

const getSyncCode = (
	{ utilFileName, formattersTemplateFileName, typesFileName, banner, baseLocale }: GeneratorConfigWithDefaultValues,
	locales: Locale[],
) => {
	const localesImports = locales
		.map(
			(locale) => `
import ${sanitizeLocale(locale)} from '${relativeFolderImportPath(locale)}'`,
		)
		.join('')

	const localesTranslations = locales.map((locale) => getLocalesTranslationRowSync(locale, baseLocale)).join('')

	return `${OVERRIDE_WARNING}${tsCheck}
${banner}

${jsDocImports(
	{ from: relativeFileImportPath(typesFileName), type: 'Locales' },
	{ from: relativeFileImportPath(typesFileName), type: 'Translation' },
)}

import { initFormatters } from './${formattersTemplateFileName}'
${importTypes(relativeFileImportPath(typesFileName), 'Locales', 'Translation')}
import { loadedFormatters, loadedLocales, locales } from './${utilFileName}'

${localesImports}

const localeTranslations = {${localesTranslations}
}

export const loadLocale = (locale: Locales) => {
	if (loadedLocales[locale]) return

	loadedLocales[locale] = localeTranslations[locale]${typeCast('Translation')}
	loadFormatters(locale)
}

export const loadAllLocales = () => locales.forEach(loadLocale)

export const loadFormatters = (locale: Locales) =>
	loadedFormatters[locale] = initFormatters(locale)
`
}

export const generateSyncUtil = async (config: GeneratorConfigWithDefaultValues, locales: Locale[]): Promise<void> => {
	const { outputPath, utilFileName } = config

	const syncCode = getSyncCode(config, locales)
	await writeFileIfContainsChanges(outputPath, `${utilFileName}.sync`, prettify(syncCode))
}
