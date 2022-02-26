import { isParsedResultEntry, type ParsedResult, type ParsedResultEntry } from '../../types'

export const flattenToParsedResultEntry = (parsedResults: ParsedResult[]): ParsedResultEntry[] =>
	parsedResults.flatMap((parsedResult) =>
		isParsedResultEntry(parsedResult)
			? parsedResult
			: Object.entries(parsedResult).flatMap(([_, nestedParsedResults]) =>
					flattenToParsedResultEntry(nestedParsedResults),
			  ),
	)

export const mapToString = <T>(items: T[], mappingFunction: (item: T) => string): string =>
	items.map(mappingFunction).join('')

export const wrapObjectType = <T>(array: T[], callback: () => string) =>
	!array.length
		? '{}'
		: `{${callback()}
}`
