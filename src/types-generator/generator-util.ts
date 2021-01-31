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

export type TypescriptVersion = {
	major: number
	minor: number
}

export const parseTypescriptVersion = (versionMajorMinor: `${number}.${number}`): TypescriptVersion => {
	const [major, minor] = versionMajorMinor.split('.').map((item) => +item) as [number, number]

	return {
		major,
		minor,
	}
}

export const supportsTemplateLiteralTypes = ({ major, minor }: TypescriptVersion): boolean =>
	(major === 4 && minor >= 1) || major >= 5

export const supportsImportType = ({ major, minor }: TypescriptVersion): boolean =>
	(major === 3 && minor >= 8) || major >= 4

// --------------------------------------------------------------------------------------------------------------------

export type Logger = {
	info: (...messages: unknown[]) => void
	warn: (...messages: unknown[]) => void
	error: (...messages: unknown[]) => void
}

const log = (console: Console, type: 'info' | 'warn' | 'error', ...messages: unknown[]) =>
	console[type]('[LANGAUGE]', ...messages)

export const createLogger = (console: Console): Logger => {
	return {
		info: log.bind(null, console, 'info'),
		warn: log.bind(null, console, 'warn', 'WARNING:'),
		error: log.bind(null, console, 'error', 'ERROR:'),
	}
}

export const logger = createLogger(console)
