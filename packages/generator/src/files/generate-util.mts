import type { GeneratorConfigWithDefaultValues } from '../../../config/src/types.mjs'
import type { Locale } from '../../../runtime/src/core.mjs'
import {
	generics,
	importTypes,
	jsDocFunction,
	jsDocImports,
	jsDocType,
	OVERRIDE_WARNING,
	relativeFileImportPath,
	tsCheck,
	type,
	typeCast
} from '../output-handler.mjs'
import { writeFileIfContainsChanges } from '../utils/file.utils.mjs'
import { prettify } from '../utils/generator.utils.mjs'

const getUtil = (config: GeneratorConfigWithDefaultValues, locales: Locale[], namespaces: string[]): string => {
	const { typesFileName, baseLocale, banner } = config

	const usesNamespaces = !!namespaces.length

	const localesEnum = `
${jsDocType('Locales[]')}
export const locales${type('Locales[]')} = [${locales.map(
		(locale) => `
	'${locale}'`,
	)}
]`

	const namespacesEnum = usesNamespaces
		? `

${jsDocType('Namespaces[]')}
export const namespaces${type('Namespaces[]')} = [${namespaces.map(
				(namespace) => `
	'${namespace}'`,
		  )}
]
`
		: ''

	return `${OVERRIDE_WARNING}${tsCheck}
${banner}

${jsDocImports(
	{ from: 'typesafe-i18n', type: 'TranslateByString' },
	{ from: 'typesafe-i18n', type: 'LocaleTranslations<Locales, Translations>', alias: 'LocaleTranslations' },
	{
		from: 'typesafe-i18n',
		type: 'LocaleTranslationFunctions<Locales, Translations, TranslationFunctions>',
		alias: 'LocaleTranslationFunctions',
	},
	{ from: 'typesafe-i18n/detectors', type: 'LocaleDetector' },
	{ from: relativeFileImportPath(typesFileName), type: 'Locales' },
	usesNamespaces && { from: relativeFileImportPath(typesFileName), type: 'Namespaces' },
	{ from: relativeFileImportPath(typesFileName), type: 'Formatters' },
	{ from: relativeFileImportPath(typesFileName), type: 'Translations' },
	{ from: relativeFileImportPath(typesFileName), type: 'TranslationFunctions' },
)}

import { i18n as initI18n, i18nObject as initI18nObject, i18nString as initI18nString } from 'typesafe-i18n'
${importTypes('typesafe-i18n/detectors', 'LocaleDetector')}
${importTypes('typesafe-i18n', 'LocaleTranslationFunctions', 'TranslateByString')}
import { detectLocale as detectLocaleFn } from 'typesafe-i18n/detectors'
import { initExtendDictionary } from 'typesafe-i18n/utils'
${importTypes(
	relativeFileImportPath(typesFileName),
	'Formatters',
	'Locales',
	usesNamespaces && 'Namespaces',
	'Translations',
	'TranslationFunctions',
)}

${jsDocType('Locales')}
export const baseLocale${type('Locales')} = '${baseLocale}'

${localesEnum}
${namespacesEnum}
${jsDocFunction('locale is Locales', {
	type: 'string',
	name: 'locale',
})}
export const isLocale = (locale${type('string')})${type('locale is Locales')} => locales.includes(${jsDocType(
		'Locales',
		`locale${typeCast('Locales')}`,
	)})
${
	usesNamespaces
		? `
${jsDocFunction('namespace is Namespaces', {
	type: 'string',
	name: 'namespace',
})}
export const isNamespace = (namespace${type('string')})${type(
				'namespace is Namespaces',
		  )} => namespaces.includes(${jsDocType('Namespaces', `namespace${typeCast('Namespaces')}`)})`
		: ''
}

export const loadedLocales${type('Record<Locales, Translations>')} = ${jsDocType(
		'Record<Locales, Translations>',
		`{}${typeCast('Record<Locales, Translations>')}`,
	)}

export const loadedFormatters${type('Record<Locales, Formatters>')} = ${jsDocType(
		'Record<Locales, Formatters>',
		`{}${typeCast('Record<Locales, Formatters>')}`,
	)}

${jsDocType('ReturnType<typeof initExtendDictionary<Translations>>')}
export const extendDictionary = initExtendDictionary${generics('Translations')}()

${jsDocFunction('TranslateByString', {
	type: 'Locales',
	name: 'locale',
})}
export const i18nString = (locale${type('Locales')})${type('TranslateByString')} => initI18nString${generics(
		'Locales',
		'Formatters',
	)}(locale, loadedFormatters[locale])

${jsDocFunction('TranslationFunctions', { type: 'Locales', name: 'locale' })}
export const i18nObject = (locale${type('Locales')})${type('TranslationFunctions')} =>
	initI18nObject${generics('Locales', 'Translations', 'TranslationFunctions', 'Formatters')}(
		locale,
		loadedLocales[locale],
		loadedFormatters[locale]
	)

${jsDocFunction('LocaleTranslationFunctions')}
export const i18n = ()${type('LocaleTranslationFunctions<Locales, Translations, TranslationFunctions>')} =>
	initI18n${generics('Locales', 'Translations', 'TranslationFunctions', 'Formatters')}(loadedLocales, loadedFormatters)

${jsDocFunction('Locales', { type: 'LocaleDetector[]', name: 'detectors' })}
export const detectLocale = (...detectors${type('LocaleDetector[]')})${type('Locales')} => detectLocaleFn${generics(
		'Locales',
	)}(baseLocale, locales, ...detectors)
`
}

export const generateUtil = async (
	config: GeneratorConfigWithDefaultValues,
	locales: Locale[],
	namespaces: string[],
): Promise<void> => {
	const { outputPath, utilFileName: utilFile } = config

	const util = getUtil(config, locales, namespaces)
	await writeFileIfContainsChanges(outputPath, utilFile, prettify(util))
}
