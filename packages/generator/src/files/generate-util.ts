import { GeneratorConfigWithDefaultValues } from '../../../config/src/config'
import type { Locale } from '../../../core/src/core'
import type { GeneratorConfigWithDefaultValues } from '../config-types'
import { writeFileIfContainsChanges } from '../file-utils'
import { prettify, sanitizeLocale } from '../generator-util'
import {
	generics,
	importTypes,
	jsDocFunction,
	jsDocImports,
	jsDocTsIgnore,
	jsDocType,
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

const getAsyncCode = ({ locales }: GeneratorConfigWithDefaultValues) => {
	const localesTranslationLoaders = locales.map(getLocalesTranslationRowAsync).join('')

	return `
${jsDocType('Record<Locales, () => Promise<any>>')}
const localeTranslationLoaders = {${localesTranslationLoaders}
}

${jsDocFunction('Promise<Translation>', { type: 'Locales', name: 'locale' })}
export const getTranslationForLocale = async (locale${type(
		'Locales',
	)}) => (await (localeTranslationLoaders[locale] || localeTranslationLoaders[baseLocale])()).default${typeCast(
		'Translation',
	)}

${jsDocFunction('Promise<TranslationFunctions>', { type: 'Locales', name: 'locale' })}
export const i18nObject = (locale${type('Locales')}) => i18nObjectLoaderAsync${generics(
		'Locales',
		'Translation',
		'TranslationFunctions',
		'Formatters',
	)}(locale, getTranslationForLocale, initFormatters)
`
}

const getLocalesTranslationRowSync = (locale: Locale, baseLocale: string): string => {
	const sanitizedLocale = sanitizeLocale(locale)
	const needsEscaping = locale !== sanitizedLocale

	const postfix =
		locale === baseLocale
			? `: ${sanitizedLocale}${typeCast('Translation')}`
			: needsEscaping
			? `: ${sanitizedLocale}`
			: ''

	const wrappedLocale = needsEscaping ? `'${locale}'` : locale

	return `${locale === baseLocale ? jsDocTsIgnore : ''}
	${wrappedLocale}${postfix},`
}

const getSyncCode = ({ baseLocale, locales }: GeneratorConfigWithDefaultValues) => {
	const localesImports = locales
		.map(
			(locale) => `
import ${sanitizeLocale(locale)} from '${relativeFolderImportPath(locale)}'`,
		)
		.join('')

	const localesTranslations = locales.map((locale) => getLocalesTranslationRowSync(locale, baseLocale)).join('')
	return `${localesImports}

${jsDocType('LocaleTranslations')}
const localeTranslations${type('LocaleTranslations<Locales, Translation>')} = {${localesTranslations}
}

${jsDocFunction('Translation', { type: 'Locales', name: 'locale' })}
export const getTranslationForLocale = (locale${type(
		'Locales',
	)}) => localeTranslations[locale] || localeTranslations[baseLocale]

${jsDocFunction('TranslationFunctions', { type: 'Locales', name: 'locale' })}
export const i18nObject = (locale${type('Locales')}) => i18nObjectLoader${generics(
		'Locales',
		'Translation',
		'TranslationFunctions',
		'Formatters',
	)}(locale, getTranslationForLocale, initFormatters)

${jsDocFunction('LocaleTranslationFunctions')}
export const i18n = () => initI18n${generics(
		'Locales',
		'Translation',
		'TranslationFunctions',
		'Formatters',
	)}(getTranslationForLocale, initFormatters)
`
}

const getUtil = (config: GeneratorConfigWithDefaultValues): string => {
	const {
		typesFileName,
		formattersTemplateFileName: formattersTemplatePath,
		loadLocalesAsync,
		baseLocale,
		locales,
		banner,
	} = config

	const dynamicImports = loadLocalesAsync
		? `import { i18nString as initI18nString, i18nObjectLoaderAsync } from 'typesafe-i18n'`
		: `${importTypes('typesafe-i18n', 'LocaleTranslations')}
import { i18nString as initI18nString, i18nObjectLoader, i18n as initI18n } from 'typesafe-i18n'`

	const dynamicCode = loadLocalesAsync ? getAsyncCode(config) : getSyncCode(config)

	const localesEnum = `
${jsDocType('Locales[]')}
export const locales${type('Locales[]')} = [${locales.map(
		(locale) => `
	'${locale}'`,
	)}
]`

	return `${OVERRIDE_WARNING}${tsCheck}
${banner}

${jsDocImports(
	{ from: 'typesafe-i18n', type: 'TranslateByString' },
	{ from: 'typesafe-i18n', type: 'LocaleTranslations<Locales, Translation>', alias: 'LocaleTranslations' },
	!loadLocalesAsync ? { from: 'typesafe-i18n', type: 'LocaleTranslationFunctions' } : undefined,
	{ from: 'typesafe-i18n/detectors', type: 'LocaleDetector' },
	{ from: relativeFileImportPath(typesFileName), type: 'Locales' },
	{ from: relativeFileImportPath(typesFileName), type: 'Translation' },
	{ from: relativeFileImportPath(typesFileName), type: 'TranslationFunctions' },
)}

${dynamicImports}
${importTypes(relativeFileImportPath(typesFileName), 'Translation', 'TranslationFunctions', 'Formatters', 'Locales')}
${importTypes('typesafe-i18n/detectors', 'LocaleDetector')}
import { detectLocale as detectLocaleFn } from 'typesafe-i18n/detectors'
import { initFormatters } from '${relativeFileImportPath(formattersTemplatePath)}'

${jsDocType('Locales')}
export const baseLocale${type('Locales')} = '${baseLocale}'

${localesEnum}
${dynamicCode}

${jsDocFunction(loadLocalesAsync ? 'Promise<TranslateByString>' : 'TranslateByString', {
	type: 'Locales',
	name: 'locale',
})}
export const i18nString = ${loadLocalesAsync ? 'async ' : ''}(locale${type('Locales')}) => initI18nString${generics(
		'Locales',
		'Formatters',
	)}(locale, ${loadLocalesAsync ? 'await ' : ''}initFormatters(locale))

${jsDocFunction('Locales', { type: 'LocaleDetector[]', name: 'detectors' })}
export const detectLocale = (...detectors${type('LocaleDetector[]')}) => detectLocaleFn${generics(
		'Locales',
	)}(baseLocale, locales, ...detectors)
`
}

export const generateUtil = async (config: GeneratorConfigWithDefaultValues): Promise<void> => {
	const { outputPath, utilFileName: utilFile } = config

	const util = getUtil(config)
	await writeFileIfContainsChanges(outputPath, utilFile, prettify(util))
}
