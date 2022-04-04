import type { GeneratorConfigWithDefaultValues } from '../../../config/src/types'
import type { Locale } from '../../../runtime/src/core'
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
	)}, namespace${type('Namespace')}) => {
	const dictionary = getDictionary(locale)
	dictionary[namespace] = (await (localeNamespaceLoaders[locale][namespace])()).default${typeCast(
		'Translations[Namespace]',
	)}
}
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

${jsDocFunction('Translations', { type: 'Locales', name: 'locale' })}
const getDictionary = (locale${type('Locales')}) =>
	loadedLocales[locale] || (loadedLocales[locale] = ${jsDocType('Translations', '{}')}${typeCast('Translations')})

${jsDocFunction('Promise<void>', { type: 'Locales', name: 'locale' })}
export const loadLocaleAsync = async (locale${type('Locales')}) => {
	loadedLocales[locale] = {
		...getDictionary(locale),
		...${jsDocType('Translations', `(await localeTranslationLoaders[locale]()).default${typeCast('Translations')}`)}
	}

	loadFormatters(locale)
}

export const loadAllLocalesAsync = () => Promise.all(locales.map(loadLocaleAsync))

${jsDocFunction('void', { type: 'Locales', name: 'locale' })}
export const loadFormatters = (locale${type('Locales')}) => {
	loadedFormatters[locale] = initFormatters(locale)
}
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
