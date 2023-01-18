import { sortStringPropertyASC, uniqueArray } from 'typesafe-utils'
import { isTransformParameterFormatterPart } from '../../../../parser/src/advanced.mjs'
import type { ParsedResult } from '../../types.mjs'
import { wrapObjectKeyIfNeeded } from '../../utils/generator.utils.mjs'
import { flattenToParsedResultEntry, mapToString, wrapObjectType } from './_utils.mjs'

const getUniqueFormatters = (parsedTranslations: ParsedResult[]): [string, string[]][] => {
	const map = {} as { [key: string]: string[] }

	flattenToParsedResultEntry(parsedTranslations).forEach((parsedResult) => {
		const { types, args = [] } = parsedResult
		args.forEach(({ key, transforms: formatters }) =>
			(formatters || [])
				.filter(isTransformParameterFormatterPart)
				.forEach(({ name }) => (map[name] = [...(map[name] || []), ...(types[key]?.types || [])])),
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
