import { filterDuplicates, sortStringASC } from 'typesafe-utils'
import { COMMA_SEPARATION } from '../../constants.mjs'
import { importTypeStatement } from '../../output-handler.mjs'
import { isParsedResultEntry, ParsedResult } from '../../types.mjs'

const BASE_TYPES = [
	'boolean',
	'number',
	'bigint',
	'string',
	'Date',
	'object',
	'undefined',
	'null',
	'unknown',
	'LocalizedString',
].flatMap((t: string) => [t, `${t}[]`, `Array<${t}>`])

const extractTypes = (parsedTranslations: ParsedResult[]): string[] =>
	parsedTranslations.flatMap((parsedTranslation) => {
		if (isParsedResultEntry(parsedTranslation)) {
			return Object.values(parsedTranslation.types)
				.map(({ types }) => types)
				.flat()
		}

		return extractTypes(Object.values(parsedTranslation).flat())
	})

export const createTypeImports = (parsedTranslations: ParsedResult[], typesTemplatePath: string): string => {
	const types = extractTypes(parsedTranslations).filter(filterDuplicates)

	const externalTypes = Array.from(types)
		.filter(
			(type) => !BASE_TYPES.includes(type) && !(type.includes('|') || type.startsWith("'") || type.endsWith("'")),
		)
		.sort(sortStringASC)

	if (!externalTypes.length) return ''

	return `
${importTypeStatement} { ${externalTypes.join(COMMA_SEPARATION)} } from './${typesTemplatePath.replace('.ts', '')}'
`
}
