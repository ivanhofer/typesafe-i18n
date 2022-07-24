import { partAsStringWithoutTypes } from '@typesafe-i18n/runtime/core-utils.mjs'
import { isArray, isPropertyFalsy } from 'typesafe-utils'
import { NEW_LINE, PIPE_SEPARATION, REGEX_BRACKETS } from '../../constants'
import { supportsTemplateLiteralTypes } from '../../output-handler.mjs'
import { isParsedResultEntry, type Arg, type JsDocInfo, type JsDocInfos, type ParsedResult } from '../../types'
import { getWrappedString } from '../../utils/dictionary.utils'
import { wrapObjectKeyIfNeeded } from '../../utils/generator.utils.mjs'
import { getTypeNameForNamespace } from '../../utils/namespaces.utils'
import { createJsDocsString } from './jsdoc'
import { getNestedKey, mapToString, processNestedParsedResult, wrapObjectType } from './_utils'

export const createTranslationType = (
	parsedTranslations: ParsedResult[],
	jsDocInfo: JsDocInfos,
	nameOfType: string,
	namespaces: string[] = [],
): string => {
	const parsedTranslationsWithoutNamespaces = parsedTranslations.filter((parsedResult) => {
		const keys = Object.keys(parsedResult)
		return keys.length > 1 || !namespaces.includes(keys[0] as string)
	})

	const translationType = `type ${nameOfType} = ${wrapObjectType(parsedTranslationsWithoutNamespaces, () =>
		mapToString(parsedTranslationsWithoutNamespaces, (parsedResultEntry) =>
			createTranslationTypeEntry(parsedResultEntry, jsDocInfo),
		),
	)}`

	const parsedNamespaceTranslations = parsedTranslations.filter((parsedResult) => {
		const keys = Object.keys(parsedResult)
		return keys.length === 1 && namespaces.includes(keys[0] as string)
	})

	const namespaceTranslationsTypes = parsedNamespaceTranslations
		.map((value) => {
			return Object.entries(value).flat() as [string, ParsedResult[]]
		})
		.map(([namespace, parsedTranslations]) => {
			if (!isArray(parsedTranslations)) return ''

			return (
				'export ' +
				createTranslationType(
					isArray(parsedTranslations) ? parsedTranslations : [parsedTranslations],
					jsDocInfo,
					getTypeNameForNamespace(namespace),
				)
			)
		})

	return `${translationType}

${namespaceTranslationsTypes.join(NEW_LINE + NEW_LINE)}`
}

const createTranslationTypeEntry = (resultEntry: ParsedResult, jsDocInfo: JsDocInfos): string => {
	if (isParsedResultEntry(resultEntry)) {
		const { key, args, parentKeys } = resultEntry

		const nestedKey = getNestedKey(key, parentKeys)
		const jsDocString = createJsDocsString(jsDocInfo[nestedKey] as JsDocInfo, true, false)
		const translationType = generateTranslationType(args)

		return `
	${jsDocString}${wrapObjectKeyIfNeeded(key)}: ${translationType}`
	}

	return processNestedParsedResult(resultEntry, (parsedResultEntry) =>
		createTranslationTypeEntry(parsedResultEntry, jsDocInfo),
	)
}

const getFormatterType = (formatter: string) => {
	if (!formatter.startsWith('{')) return formatter

	const cases = formatter
		.replace(REGEX_BRACKETS, '')
		.split(',')
		.map((part) => part.split(':'))
		.map(([key]) => [key, `\${string}`])
		.map((part) => part.join(':'))
		.join(',')

	return `{${cases}}`
}

const generateTranslationType = (args: Arg[] = []) => {
	const argStrings = args
		.filter(isPropertyFalsy('pluralOnly'))
		.map(({ key, optional, formatters }) =>
			partAsStringWithoutTypes({ k: key, n: optional, f: formatters?.map(getFormatterType) }).replace(
				REGEX_BRACKETS,
				'',
			),
		)

	return supportsTemplateLiteralTypes && argStrings.length
		? `RequiredParams<${argStrings.map((arg) => getWrappedString(arg, true)).join(PIPE_SEPARATION)}>`
		: 'string'
}
