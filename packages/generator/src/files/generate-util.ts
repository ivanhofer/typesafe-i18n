import type { Locale } from '../../../core/src/core'
import { writeFileIfContainsChanges } from '../file-utils'
import { GeneratorConfigWithDefaultValues } from '../generate-files'
import { prettify, sanitizeLocale } from '../generator-util'
import { generics, importTypes, OVERRIDE_WARNING, tsCheck, type, typeCast } from '../output-handler'

const getLocalesTranslationRowAsync = (locale: Locale): string => {
	const sanitizedLocale = sanitizeLocale(locale)
	const needsEscaping = locale !== sanitizedLocale

	const wrappedLocale = needsEscaping ? `'${locale}'` : locale

	return `
	${wrappedLocale}: () => import('./${locale}'),`
}

const getAsyncCode = ({ locales }: GeneratorConfigWithDefaultValues) => {
	const localesTranslationLoaders = locales.map(getLocalesTranslationRowAsync).join('')

	return `
const localeTranslationLoaders = {${localesTranslationLoaders}
}

export const getTranslationForLocale = async (locale${type('Locales')}) => (await (localeTranslationLoaders[locale] || localeTranslationLoaders[baseLocale])()).default${typeCast('Translation')}

export const i18nObject = (locale${type('Locales')}) => i18nObjectLoaderAsync${generics('Locales', 'Translation', 'TranslationFunctions', 'Formatters')}(locale, getTranslationForLocale, initFormatters)
`
}

const getLocalesTranslationRowSync = (locale: Locale, baseLocale: string): string => {
	const sanitizedLocale = sanitizeLocale(locale)
	const needsEscaping = locale !== sanitizedLocale

	const postfix =
		locale === baseLocale ? `: ${sanitizedLocale}${typeCast('Translation')}` : needsEscaping ? `: ${sanitizedLocale}` : ''

	const wrappedLocale = needsEscaping ? `'${locale}'` : locale

	return `
	${wrappedLocale}${postfix},`
}

const getSyncCode = ({ baseLocale, locales }: GeneratorConfigWithDefaultValues) => {
	const localesImports = locales
		.map(
			(locale) => `
import ${sanitizeLocale(locale)} from './${locale}'`,
		)
		.join('')

	const localesTranslations = locales.map((locale) => getLocalesTranslationRowSync(locale, baseLocale)).join('')
	return `${localesImports}

const localeTranslations${type('LocaleTranslations<Locales, Translation>')} = {${localesTranslations}
}

export const getTranslationForLocale = (locale${type('Locales')}) => localeTranslations[locale] || localeTranslations[baseLocale]

export const i18nObject = (locale${type('Locales')}) => i18nObjectLoader${generics('Locales', 'Translation', 'TranslationFunctions', 'Formatters')}(locale, getTranslationForLocale, initFormatters)

export const i18n = () => initI18n${generics('Locales', 'Translation', 'TranslationFunctions', 'Formatters')}(getTranslationForLocale, initFormatters)
`
}

const getUtil = (config: GeneratorConfigWithDefaultValues): string => {
	const {
		typesFileName: typesFile,
		formattersTemplateFileName: formattersTemplatePath,
		loadLocalesAsync,
		baseLocale,
		locales,
		banner
	} = config

	const dynamicImports = loadLocalesAsync
		? `import { i18nString as initI18nString, i18nObjectLoaderAsync } from 'typesafe-i18n'`
		: `${importTypes('typesafe-i18n', 'LocaleTranslations')}
import { i18nString as initI18nString, i18nObjectLoader, i18n as initI18n } from 'typesafe-i18n'`

	const dynamicCode = loadLocalesAsync ? getAsyncCode(config) : getSyncCode(config)

	const localesEnum = `export const locales${type('Locales[]')} = [${locales.map(
		(locale) => `
	'${locale}'`,
	)}
]`

	return `${OVERRIDE_WARNING}${tsCheck}
${banner}

${dynamicImports}
${importTypes(`./${typesFile}`, 'Translation', 'TranslationFunctions', 'Formatters', 'Locales')}
${importTypes('typesafe-i18n/detectors', 'LocaleDetector')}
import { detectLocale as detectLocaleFn } from 'typesafe-i18n/detectors'
import { initFormatters } from './${formattersTemplatePath}'

export const baseLocale${type('Locales')} = '${baseLocale}'

${localesEnum}
${dynamicCode}
export const i18nString = ${loadLocalesAsync ? 'async ' : ''
		}(locale${type('Locales')}) => initI18nString${generics('Locales', 'Formatters')}(locale, ${loadLocalesAsync ? 'await ' : ''
		}initFormatters(locale))

export const detectLocale = (...detectors${type('LocaleDetector[]')}) => detectLocaleFn${generics('Locales')}(baseLocale, locales, ...detectors)
`
}

export const generateUtil = async (config: GeneratorConfigWithDefaultValues): Promise<void> => {
	const { outputPath, utilFileName: utilFile } = config

	const util = getUtil(config)
	await writeFileIfContainsChanges(outputPath, utilFile, prettify(util))
}
