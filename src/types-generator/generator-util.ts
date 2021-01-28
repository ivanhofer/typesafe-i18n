import { TsVersion } from './generator'

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

export const supportsTemplateLiteralTypes = (tsVersion: TsVersion): boolean =>
	((TsVersion[tsVersion] as unknown) as TsVersion) >= TsVersion['>=4.1']

export const supportsImportType = (tsVersion: TsVersion): boolean =>
	((TsVersion[tsVersion] as unknown) as TsVersion) >= TsVersion['>=3.8']
