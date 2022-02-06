import type { GeneratorConfigWithDefaultValues } from '../../../config/src/types'
import type { Locale } from '../../../runtime/src/core'
import { writeFileIfContainsChanges } from '../file-utils'
import { prettify, sanitizePath, wrapObjectKeyIfNeeded } from '../generator-util'
import {
	importTypes,
	jsDocFunction,
	jsDocImports,
	jsDocType,
	OVERRIDE_WARNING,
	relativeFileImportPath,
	relativeFolderImportPath,
	tsCheck,
	type,
	typeCast,
} from '../output-handler'

const getLocalesTranslationRowSync = (locale: Locale): string => {
	const sanitizedLocale = sanitizePath(locale)
	const needsEscaping = locale !== sanitizedLocale
	const postfix = needsEscaping ? `: ${sanitizedLocale}` : ''

	return `
	${wrapObjectKeyIfNeeded(locale)}${postfix},`
}

const getSyncCode = (
	{ utilFileName, formattersTemplateFileName, typesFileName, banner }: GeneratorConfigWithDefaultValues,
	locales: Locale[],
) => {
	const localesImports = locales
		.map(
			(locale) => `
import ${sanitizePath(locale)} from '${relativeFolderImportPath(locale)}'`,
		)
		.join('')

	const localesTranslations = locales.map((locale) => getLocalesTranslationRowSync(locale)).join('')

	return `${OVERRIDE_WARNING}${tsCheck}
${banner}

${jsDocImports(
	{ from: relativeFileImportPath(typesFileName), type: 'Locales' },
	{ from: relativeFileImportPath(typesFileName), type: 'Translations' },
)}

import { initFormatters } from './${formattersTemplateFileName}'
${importTypes(relativeFileImportPath(typesFileName), 'Locales', 'Translations')}
import { loadedFormatters, loadedLocales, locales } from './${utilFileName}'

${localesImports}

const localeTranslations = {${localesTranslations}
}

${jsDocFunction('void', { type: 'Locales', name: 'locale' })}
export const loadLocale = (locale${type('Locales')}) => {
	if (loadedLocales[locale]) return

	loadedLocales[locale] = ${jsDocType(
		'Translations',
		jsDocType('unknown', `localeTranslations[locale]${typeCast('unknown')}${typeCast('Translations')}`),
	)}
	loadFormatters(locale)
}

export const loadAllLocales = () => locales.forEach(loadLocale)

${jsDocFunction('void', { type: 'Locales', name: 'locale' })}
export const loadFormatters = (locale${type('Locales')}) => {
	loadedFormatters[locale] = initFormatters(locale)
}
`
}

export const generateSyncUtil = async (config: GeneratorConfigWithDefaultValues, locales: Locale[]): Promise<void> => {
	const { outputPath, utilFileName } = config

	const syncCode = getSyncCode(config, locales)
	await writeFileIfContainsChanges(outputPath, `${utilFileName}.sync`, prettify(syncCode))
}
