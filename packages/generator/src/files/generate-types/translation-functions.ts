import { filterDuplicatesByKey } from 'typesafe-utils'
import { COMMA_SEPARATION } from '../../constants'
import {
	isParsedResultEntry,
	type Arg,
	type JsDocInfo,
	type JsDocInfos,
	type ParsedResult,
	type Types,
} from '../../types'
import { wrapObjectKeyIfNeeded } from '../../utils/generator.utils.mjs'
import { createJsDocsString } from './jsdoc'
import { getNestedKey, mapToString, processNestedParsedResult, wrapObjectType } from './_utils'

export const createTranslationFunctionsType = (parsedTranslations: ParsedResult[], jsDocInfo: JsDocInfos) =>
	`export type TranslationFunctions = ${wrapObjectType(parsedTranslations, () =>
		mapToString(parsedTranslations, (translation) => createTranslationFunctionType(translation, jsDocInfo)),
	)}`

const createTranslationFunctionType = (parsedResult: ParsedResult, jsDocInfo: JsDocInfos): string => {
	if (isParsedResultEntry(parsedResult)) {
		const { key, args, types, parentKeys } = parsedResult
		const nestedKey = getNestedKey(key, parentKeys)
		const jsDocString = createJsDocsString(jsDocInfo[nestedKey] as JsDocInfo)

		return `
	${jsDocString}${wrapObjectKeyIfNeeded(key)}: (${mapTranslationFunctions(args, types)}) => LocalizedString`
	}

	return processNestedParsedResult(parsedResult, (parsedResultEntry) =>
		createTranslationFunctionType(parsedResultEntry, jsDocInfo),
	)
}

const mapTranslationFunctions = (args: Arg[] = [], types: Types) => {
	if (!args.length) return ''

	const uniqueArgs = args.filter(filterDuplicatesByKey('key'))
	const arg = uniqueArgs[0]?.key as string

	const isKeyed = isNaN(+arg)
	const prefix = (isKeyed && 'arg: { ') || ''
	const postfix = (isKeyed && ' }') || ''
	const argPrefix = (!isKeyed && 'arg') || ''

	return (
		prefix +
		uniqueArgs
			.map(({ key, optional }) => `${argPrefix}${key}${optional ? '?' : ''}: ${types[key]?.types.join(' | ')}`)
			.join(COMMA_SEPARATION) +
		postfix
	)
}
