import { isObject, not } from 'typesafe-utils'
import { parseRawText } from '../core/parser'
import type { InjectorPart, Part, SingularPluralPart, LangaugeBaseTranslation } from '../types'
import { updateTypesIfContainsChanges } from './file-utils'

type GenerateTypesConfig = {
	file?: string
	path?: string
}

type IsSingularPluralPart<T> = T extends SingularPluralPart ? T : never

const isSingularPluralPart = <T extends Part>(part: T): part is IsSingularPluralPart<T> =>
	!!(<SingularPluralPart>part).p

const parseTanslationObject = ([key, text]: [string, string]) => {
	const args: string[] = []
	const formatters: string[] = []

	parseRawText(text, false)
		.filter(isObject)
		.filter(not<InjectorPart>(isSingularPluralPart))
		.forEach((injectorPart) => {
			const { k, f } = injectorPart
			k && args.push(k)
			f && formatters.push(...f)
		})

	return [key, args, formatters]
}

const wrapType = (array: unknown[], callback: () => string) =>
	!array.length
		? `{ }`
		: `{${callback()}
}`

const createKeysType = (keys: string[]) =>
	`export type LangaugeTranslation = ${wrapType(keys, () =>
		keys
			.map(
				(key) =>
					`
	${key}: string`,
			)
			.join(''),
	)}`

const createFormatterType = (formatterKeys: string[]) =>
	`export type LangaugeFormatters = ${wrapType(formatterKeys, () =>
		formatterKeys
			.map(
				(key) =>
					`
	${key}: (value: any) => string`,
			)
			.join(''),
	)}`

const createTranslationsType = (translations: [key: string, args: string[]][]) =>
	`export type LangaugeTranslationArgs = ${wrapType(translations, () =>
		translations
			.map(
				(translation) =>
					`
	${createTranslationType(translation)}`,
			)
			.join(''),
	)}`

const createTranslationType = ([key, args]: [key: string, args: string[]]) =>
	`${key}: (${mapTranslationArgs(args)}) => string`

const mapTranslationArgs = (args: string[]) => {
	if (!args.length) {
		return ''
	}

	const arg = args[0] as string

	const isKeyed = isNaN(+arg)
	const prefix = (isKeyed && 'arg: { ') || ''
	const postfix = (isKeyed && ' }') || ''
	const argPrefix = (!isKeyed && 'arg') || ''

	return prefix + args.map((arg) => `${argPrefix}${arg}: unknown`).join(', ') + postfix
}

const getTypes = (translationObject: LangaugeBaseTranslation) => {
	const result = Object.entries(translationObject).map(parseTanslationObject)

	const keys = result.map(([k]) => k as string)
	const keysType = createKeysType(keys)

	const formatters = result
		.flatMap(([_k, _a, f]) => f as string[])
		.reduce((prev, act) => [...prev, act], [] as string[])
	const formatterType = createFormatterType(formatters)

	const translations = result.map(([k, a, _f]) => [k, a as string[]] as [string, string[]])
	const translationsType = createTranslationsType(translations)

	return `import type { Config } from 'langauge'
export type { LangaugeBaseTranslation } from 'langauge'

${keysType}

${translationsType}

${formatterType}

export type LangaugeConfig = Config<LangaugeFormatters>
`
}

export const generateTypes = async (
	translationObject: LangaugeBaseTranslation,
	config: GenerateTypesConfig = {} as GenerateTypesConfig,
): Promise<void> => {
	const { path = './src/langauge/', file = 'generatedTypes.ts' } = config

	const types = getTypes(translationObject)

	await updateTypesIfContainsChanges(path, file, types)
}
