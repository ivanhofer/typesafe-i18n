import { parseRawText } from '@typesafe-i18n/parser/index.mjs'
import type { ArgumentPart } from '@typesafe-i18n/parser/types.mjs'
import { partsAsStringWithoutTypes } from '@typesafe-i18n/runtime/core-utils.mjs'
import { isPluralPart } from '@typesafe-i18n/runtime/core.mjs'
import type { BaseTranslation } from '@typesafe-i18n/runtime/index.mjs'
import {
	isArrayNotEmpty,
	isNotUndefined,
	isObject,
	isString,
	not,
	sortStringASC,
	sortStringPropertyASC,
	uniqueArray,
} from 'typesafe-utils'
import { REGEX_BRACKETS } from '../../constants.mjs'
import type { Arg, ParsedResult, ParsedResultEntry, Types } from '../../types.mjs'
import type { Logger } from '../../utils/logger.mjs'

export const parseDictionary = (
	translations: BaseTranslation | BaseTranslation[] | Readonly<BaseTranslation> | Readonly<BaseTranslation[]>,
	logger: Logger,
	parentKeys = [] as string[],
): ParsedResult[] =>
	isObject(translations)
		? Object.entries(translations).map(([key, text]) => {
				if (isString(text)) {
					return parseTranslationEntry([key, text], logger, parentKeys) as ParsedResultEntry
				}
				return { [key]: parseDictionary(text, logger, [...parentKeys, key]) } as ParsedResult
		  })
		: []

const parseTypesFromSwitchCaseStatement = (formatters: string[] | undefined) => {
	if (!formatters?.length) return undefined

	const formatter = formatters[0] as string
	if (!formatter.startsWith('{')) return undefined

	const keys = formatter
		.replace(REGEX_BRACKETS, '')
		.split(',')
		.map((s) => s.split(':'))
		.map(([key]) => key?.trim())
		.sort()

	return keys.map((key) => (key === '*' ? 'string' : `'${key}'`)).join(' | ')
}

const parseTranslationEntry = (
	[key, text]: [string, string],
	logger: Logger,
	parentKeys: string[],
): ParsedResult | null => {
	const parsedParts = parseRawText(text, false)
	const textWithoutTypes = partsAsStringWithoutTypes(parsedParts)

	const parsedObjects = parsedParts.filter(isObject)
	const argumentParts = parsedObjects.filter<ArgumentPart>(not(isPluralPart))
	const pluralParts = parsedObjects.filter(isPluralPart)

	const args: Arg[] = []
	const types: Types = {}

	argumentParts.forEach(({ k, n, i, f }) => {
		args.push({ key: k, formatters: f, optional: n })
		const type = i ?? parseTypesFromSwitchCaseStatement(f)
		types[k] = {
			types: uniqueArray([...(types[k]?.types || []), type]).filter(isNotUndefined),
			optional: types[k]?.optional || n,
		}
	})

	pluralParts.forEach(({ k }) => {
		if (!types[k]?.types.length) {
			// if key has no types => add types that are valid for a PluralPart
			types[k] = { types: ['string', 'number', 'boolean'] }
			if (!args.find(({ key }) => key === k)) {
				// if only pluralPart exists => add it as argument
				args.push({ key: k, formatters: [], pluralOnly: true })
			}
		}
	})

	// add 'unknown' if argument has no type
	Object.keys(types).forEach((key) => {
		if (!types[key]?.types.length) {
			types[key] = { types: ['unknown'], optional: types[key]?.optional }
		}
	})

	args.sort(sortStringPropertyASC('key'))

	const isValid = validateTranslation(key, types, logger)

	if (!isValid) return null

	return { key, text, textWithoutTypes, args, types, parentKeys }
}

const validateTranslation = (key: string, types: Types, logger: Logger): boolean => {
	const base = `translation '${key}' =>`

	if (key.includes('.')) {
		logger.error(
			`${base} key can't contain the '.' character. Please remove it. If you want to nest keys, you should look at https://github.com/ivanhofer/typesafe-i18n#nested-translations`,
		)
		return false
	}

	const argKeys = Object.keys(types).sort(sortStringASC)
	if (isArrayNotEmpty(argKeys) && !isNaN(+argKeys[0])) {
		let expectedKey = '0'
		for (const argKey of argKeys) {
			if (argKey !== expectedKey) {
				const info = isNaN(+argKey)
					? `You can't mix keyed and index-based arguments.`
					: `Make sure to not skip an index for your arguments.`

				logger.error(`${base} argument {${expectedKey}} expected, but {${argKey}} found.`, info)
				return false
			}
			expectedKey = (+argKey + 1).toString()
		}
	}

	return true
}
