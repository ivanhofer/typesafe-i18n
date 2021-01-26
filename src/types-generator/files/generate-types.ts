import { filterDuplicates, isObject, isTruthy, not } from 'typesafe-utils'
import { parseRawText } from '../../core/parser'
import { isPluralPart, LangaugeBaseTranslation } from '../../core/core'
import type { ArgumentPart, PluralPart } from '../../core/parser'
import { writeFileIfContainsChanges } from '../file-utils'
import { GeneratorConfigWithDefaultValues } from '../generator'

// --------------------------------------------------------------------------------------------------------------------
// types --------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------

type Arg = { key: string; types: string[] | undefined }

type FormatterFunctionKey = { formatterKey: string[]; type: string | undefined }

// --------------------------------------------------------------------------------------------------------------------
// implementation -----------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------

const mergeArgs = (args: Arg[]) => {
	const map = new Map<string, string[]>()
	args.forEach(({ key, types }) => {
		const item = map.get(key) || []
		types && item.push(...types)
		map.set(key, item)
	})

	return Array.from(map.entries()).map(([key, types]) => ({ key, types: types.filter(filterDuplicates) }))
}

const parseTanslationObject = ([key, text]: [string, string]): {
	key: string
	text: string
	args: Arg[]
	formatterFunctionKeys: FormatterFunctionKey[]
} => {
	const args: Arg[] = []
	const formatterFunctionKeys: FormatterFunctionKey[] = []

	const parsedObjects = parseRawText(text, false).filter(isObject)

	parsedObjects.filter(not<ArgumentPart | PluralPart, ArgumentPart>(isPluralPart)).forEach((injectorPart) => {
		const { k, i, f } = injectorPart

		k && args.push({ key: k, types: (i && [i]) || undefined })
		f && formatterFunctionKeys.push({ formatterKey: f, type: i })
	})

	parsedObjects.filter(isPluralPart).forEach((pluralPart) => {
		const found = args.find(({ key }) => key === pluralPart.k)
		if (!found || !found.types) {
			args.push({ key: pluralPart.k, types: ['string', 'number', 'boolean'] })
		}
	})

	const mergedArgs = mergeArgs(args)

	return { key, text, args: mergedArgs, formatterFunctionKeys }
}

const wrapObjectType = (array: unknown[], callback: () => string) =>
	!array.length
		? '{}'
		: `{${callback()}
}`

const wrapEnumType = (array: unknown[], callback: () => string) => (!array.length ? ' never' : `${callback()}`)

const createEnumType = (locales: string[]) =>
	locales
		.map(
			(locale) => `
	| '${locale}'`,
		)
		.join('')

const createLocalesType = (locales: string[]) =>
	`export type LangaugeLocale =${wrapEnumType(locales, () => createEnumType(locales))}`

const createTranslationKeysType = (keys: string[]) =>
	`export type LangaugeTranslationKeys =${wrapEnumType(keys, () => createEnumType(keys))}`

const createTranslationType = (result: { text: string; key: string }[]) =>
	`export type LangaugeTranslation = ${wrapObjectType(result, () =>
		result
			.map(
				({ text, key }) =>
					`
	${createJsDocs(text)}'${key}': string`,
			)
			.join(''),
	)}`

const createFormatterType = (formatterKeys: FormatterFunctionKey[]) => {
	const map: { [key: string]: string } = {}
	formatterKeys
		.flatMap(({ formatterKey, type }) => formatterKey.map((ff) => [ff, type || 'any'] as [string, string]))
		.forEach(([key, type]) => {
			const foundType = map[key]
			// TODO: check if  different types exist for a formatterKey
			if (!foundType || foundType === 'any') {
				map[key] = type
			}
		})

	const entries = Object.entries(map)
	return `export type LangaugeFormatters = ${wrapObjectType(entries, () =>
		entries
			.map(
				([key, type]) =>
					`
	${key}: (value: ${type}) => string`,
			)
			.join(''),
	)}`
}

const createTranslationArgsType = (translations: { key: string; text: string; args: Arg[] }[]) =>
	`export type LangaugeTranslationArgs = ${wrapObjectType(translations, () =>
		translations
			.map(
				(translation) =>
					`
	${createTranslationArgssType(translation)}`,
			)
			.join(''),
	)}`

const createJsDocs = (text: string) => `/**
	 * ${text}
	 */
	`

const createTranslationArgssType = ({ key, text, args }: { key: string; text: string; args: Arg[] }) =>
	`${createJsDocs(text)}'${key}': (${mapTranslationArgs(args)}) => string`

const mapTranslationArgs = (args: Arg[]) => {
	if (!args.length) {
		return ''
	}

	const arg = args[0]?.key as string

	const isKeyed = isNaN(+arg)
	const prefix = (isKeyed && 'arg: { ') || ''
	const postfix = (isKeyed && ' }') || ''
	const argPrefix = (!isKeyed && 'arg') || ''

	return (
		prefix +
		args.map(({ key, types }) => `${argPrefix}${key}: ${(types && types.join(' | ')) || 'unknown'}`).join(', ') +
		postfix
	)
}

const BASE_TYPES = ['boolean', 'number', 'bigint', 'string', 'Date']

const createTypeImportsType = (args: Arg[], typesTemplatePath: string): string => {
	const types = new Set(args.flatMap(({ types }) => types).filter(isTruthy))
	const externalTypes = Array.from(types).filter((type) => !BASE_TYPES.includes(type))
	return !externalTypes.length
		? ''
		: `
import type { ${externalTypes.join(', ')} } from './${typesTemplatePath.replace('.ts', '')}'
`
}

const getTypes = ({ translations: translations, baseLocale, locales, typesTemplateFileName }: GenerateTypesType) => {
	const result = (isObject(translations) && Object.entries(translations).map(parseTanslationObject)) || []

	const baseLocaleType = `export type LangaugeBaseLocale = '${baseLocale}'`

	const localesType = createLocalesType(locales?.length ? locales : [baseLocale])

	const keys = result.map(({ key }) => key)

	const translationKeysType = createTranslationKeysType(keys)

	const translationType = createTranslationType(result.map(({ text, key }) => ({ text, key })))

	const args = result.flatMap(({ args }) => args)
	const typeImports = createTypeImportsType(args, typesTemplateFileName)

	const formatterFunctionKeys = result.flatMap(({ formatterFunctionKeys }) => formatterFunctionKeys)
	const formatterType = createFormatterType(formatterFunctionKeys)

	const translationArgsType = createTranslationArgsType(result)

	return [
		`// This types were auto-generated. Any manual changes will be overwritten.
/* eslint-disable */
${typeImports}
${baseLocaleType}

${localesType}

${translationKeysType}

${translationType}

${translationArgsType}

${formatterType}

export type LangaugeFormattersInitializer = (locale: LangaugeLocale) => LangaugeFormatters
`,
		!!typeImports,
	] as [string, boolean]
}

type GenerateTypesType = GeneratorConfigWithDefaultValues & {
	translations: LangaugeBaseTranslation
}

export const generateTypes = async (config: GenerateTypesType): Promise<boolean> => {
	const { outputPath, typesFileName } = config

	const [types, hasCustomTypes] = getTypes(config)

	await writeFileIfContainsChanges(outputPath, typesFileName, types)

	return hasCustomTypes
}
