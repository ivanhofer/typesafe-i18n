import {
	isArrayNotEmpty,
	isNotUndefined,
	isObject,
	isString,
	sortStringASC,
	sortStringPropertyASC,
	uniqueArray
} from 'typesafe-utils'
import { isParameterPart, isPluralPart, parseMessage } from '../../../../parser/src/advanced/parse.mjs'
import { serializeMessageWithoutTypes } from '../../../../parser/src/advanced/serialize.mjs'
import type { BaseTranslation } from '../../../../runtime/src/index.mjs'
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

const parseTranslationEntry = (
	[key, text]: [string, string],
	logger: Logger,
	parentKeys: string[],
): ParsedResult | null => {
	const parsedMessage = parseMessage(text)
	const textWithoutTypes = serializeMessageWithoutTypes(parsedMessage)

	const args: Arg[] = []
	const typesMap: Types = {}

	parsedMessage.filter(isParameterPart).forEach(({ key, optional, types, transforms }) => {
		args.push({ key, transforms, optional })

		typesMap[key] = {
			types: uniqueArray([...(typesMap[key]?.types || []), ...types]).filter(isNotUndefined),
			optional: typesMap[key]?.optional || optional,
		}
	})

	parsedMessage.filter(isPluralPart).forEach(({ key }) => {
		if (!typesMap[key]?.types.length && !args.find((arg) => arg.key === key)) {
			typesMap[key] = {
				types: ['number', 'string', 'boolean'],
			}
			// if only pluralPart exists => add it as argument
			args.push({ key, transforms: [], pluralOnly: true })
		}
	})

	args.sort(sortStringPropertyASC('key'))

	const isValid = validateTranslation(key, typesMap, logger)
	if (!isValid) return null

	return { key, text, textWithoutTypes, args, types: typesMap, parentKeys }
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
