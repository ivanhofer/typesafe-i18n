import type { Locale } from '@typesafe-i18n/runtime/core.mjs'
import type { GeneratorConfigWithDefaultValues } from '../../../config/src/types'
import {
	generics,
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
import { writeFileIfContainsChanges } from '../utils/file.utils'
import { prettify, wrapObjectKeyIfNeeded } from '../utils/generator.utils'

const NEW_LINE_INDENTED_WITH_COMMA = `,
	`

const getLocalesTranslationRowAsync = (locale: Locale): string => `
	${wrapObjectKeyIfNeeded(locale)}: () => import('${relativeFolderImportPath(locale)}'),`

const getNamespaceLoaderForLocale = (locale: Locale, namespaces: string[]) => {
	return `${wrapObjectKeyIfNeeded(locale)}: {
	${namespaces
		.map((namespace) => `	${wrapObjectKeyIfNeeded(namespace)}: () => import('./${locale}/${namespace}')`)
		.join(NEW_LINE_INDENTED_WITH_COMMA)}
	}`
}

const generateNamespacesCode = (locales: Locale[], namespaces: string[]) => {
	const namespaceImports = `
const localeNamespaceLoaders = {
	${locales.map((locale) => getNamespaceLoaderForLocale(locale, namespaces)).join(NEW_LINE_INDENTED_WITH_COMMA)}
}`

	const namespaceLoader = `
${jsDocFunction('Promise<void>', { type: 'Locales', name: 'locale' }, { type: 'Namespaces', name: 'namespace' })}
export const loadNamespaceAsync = async ${generics('Namespace extends Namespaces')}(locale${type(
		'Locales',
	)}, namespace${type('Namespace')})${type('Promise<void>')} =>
	void updateDictionary(
		locale,
		${jsDocType(
			'Partial<Translations>',
			jsDocType(
				'unknown',
				`{ [namespace]: (await (localeNamespaceLoaders[locale][namespace])()).default }${typeCast(
					'unknown',
				)}${typeCast('Partial<Translations>')}`,
			),
		)}
	)
`
	return [namespaceImports, namespaceLoader]
}

const getAsyncCode = (
	{ utilFileName, formattersTemplateFileName, typesFileName, banner }: GeneratorConfigWithDefaultValues,
	locales: Locale[],
	namespaces: string[],
) => {
	const usesNamespaces = !!namespaces.length
	const localesTranslationLoaders = locales.map(getLocalesTranslationRowAsync).join('')
	const [namespaceImports, namespaceLoader] = usesNamespaces ? generateNamespacesCode(locales, namespaces) : ['', '']
	return `${OVERRIDE_WARNING}${tsCheck}
${banner}

${jsDocImports(
	{ from: relativeFileImportPath(typesFileName), type: 'Locales' },
	usesNamespaces && { from: relativeFileImportPath(typesFileName), type: 'Namespaces' },
	{ from: relativeFileImportPath(typesFileName), type: 'Translations' },
)}

import { initFormatters } from './${formattersTemplateFileName}'
${importTypes(relativeFileImportPath(typesFileName), 'Locales', usesNamespaces && 'Namespaces', 'Translations')}
import { loadedFormatters, loadedLocales, locales } from './${utilFileName}'

const localeTranslationLoaders = {${localesTranslationLoaders}
}
${namespaceImports}

${jsDocFunction(
	'Translations',
	{ type: 'Locales', name: 'locale' },
	{ type: 'Partial<Translations>', name: 'dictionary' },
)}
const updateDictionary = (locale${type('Locales')}, dictionary${type('Partial<Translations>')}) =>
	loadedLocales[locale] = { ...loadedLocales[locale], ...dictionary }

${jsDocFunction('Promise<void>', { type: 'Locales', name: 'locale' })}
export const loadLocaleAsync = async (locale${type('Locales')})${type('Promise<void>')} => {
	updateDictionary(
		locale,
		${jsDocType(
			'Translations',
			jsDocType(
				'unknown',
				`(await localeTranslationLoaders[locale]()).default${typeCast('unknown')}${typeCast('Translations')}`,
			),
		)}
	)
	loadFormatters(locale)
}

export const loadAllLocalesAsync = ()${type('Promise<void[]>')} => Promise.all(locales.map(loadLocaleAsync))

${jsDocFunction('void', { type: 'Locales', name: 'locale' })}
export const loadFormatters = (locale${type('Locales')})${type('void')} =>
	void (loadedFormatters[locale] = initFormatters(locale))
${namespaceLoader}`
}

export const generateAsyncUtil = async (
	config: GeneratorConfigWithDefaultValues,
	locales: Locale[],
	namespaces: string[],
): Promise<void> => {
	const { outputPath, utilFileName } = config

	const asyncCode = getAsyncCode(config, locales, namespaces)
	await writeFileIfContainsChanges(outputPath, `${utilFileName}.async`, prettify(asyncCode))
}
