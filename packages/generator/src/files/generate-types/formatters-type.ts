import { sortStringPropertyASC, uniqueArray } from 'typesafe-utils'
import type { ParsedResult } from '../../types'
import { wrapObjectKeyIfNeeded } from '../../utils/generator.utils'
import { flattenToParsedResultEntry, mapToString, wrapObjectType } from './_utils'

const getUniqueFormatters = (parsedTranslations: ParsedResult[]): [string, string[]][] => {
	const map = {} as { [key: string]: string[] }

	flattenToParsedResultEntry(parsedTranslations).forEach((parsedResult) => {
		const { types, args = [] } = parsedResult
		args.forEach(({ key, formatters }) =>
			(formatters || [])
				.filter((formatter) => !formatter.startsWith('{'))
				.forEach((formatter) => (map[formatter] = [...(map[formatter] || []), ...(types[key]?.types || [])])),
		)
	})

	return Object.entries(map).sort(sortStringPropertyASC('0'))
}

export const createFormattersType = (parsedTranslations: ParsedResult[]) => {
	const formatters = getUniqueFormatters(parsedTranslations)

	return `export type Formatters = ${wrapObjectType(formatters, () =>
		mapToString(
			formatters,
			([key, types]) =>
				`
	${wrapObjectKeyIfNeeded(key)}: (value: ${uniqueArray(types).join(' | ')}) => unknown`,
		),
	)}`
}
