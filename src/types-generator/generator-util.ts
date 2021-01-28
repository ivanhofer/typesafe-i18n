export const getPermutations = <T>(rest: T[], permutatedArray: T[] = []): T[][] => {
	if (rest.length === 0) {
		return [permutatedArray]
	}

	return rest
		.map((_, i) => {
			const curr = rest.slice()
			const next = curr.splice(i, 1)
			return getPermutations(curr.slice(), permutatedArray.concat(next))
		})
		.flat()
}

// --------------------------------------------------------------------------------------------------------------------

enum TsVersionEnum {
	'>=3.0', // baseline support
	'>=3.8', // supports import type
	'>=4.1', // supports template literal types
}

export type TsVersion = '>=3.0' | '>=3.8' | '>=4.1'

export const supportsTemplateLiteralTypes = (tsVersion: TsVersion): boolean =>
	((TsVersionEnum[tsVersion] as unknown) as TsVersionEnum) >= TsVersionEnum['>=4.1']

export const supportsImportType = (tsVersion: TsVersion): boolean =>
	((TsVersionEnum[tsVersion] as unknown) as TsVersionEnum) >= TsVersionEnum['>=3.8']

// --------------------------------------------------------------------------------------------------------------------

// eslint-disable-next-line no-console
const logger = (type: 'info' | 'warn' | 'error', ...messages: string[]) => console[type]('[LANGAUGE]', ...messages)

export const info = logger.bind(null, 'info')

export const warn = logger.bind(null, 'warn', 'WARNING:')

export const error = logger.bind(null, 'error', 'ERROR:')
