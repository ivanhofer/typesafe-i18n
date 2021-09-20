import kleur from 'kleur'
import type { Arguments, Locale } from '../../core/src/core'

export const getPermutations = <T>(rest: T[], permutedArray: T[] = []): T[][] => {
	if (rest.length === 0) {
		return [permutedArray]
	}

	return rest
		.map((_, i) => {
			const curr = rest.slice()
			const next = curr.splice(i, 1)
			return getPermutations(curr.slice(), permutedArray.concat(next))
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

// --------------------------------------------------------------------------------------------------------------------

export const sanitizeLocale = (locale: Locale): Locale => locale.replace(/-/g, '_')

export const prettify = (content: string): string =>
	content
		.replace(/^(\n)+/, '') // remove all new-lines on top of the file
		.replace(/\n\n+/g, '\n\n') // remove multiple new-lines
		.replace(/(\n)+$/, '\n') // remove all multiple trailing new-lines

// --------------------------------------------------------------------------------------------------------------------

type LogLevel = 'info' | 'warn' | 'error'

class TypesafeI18nParseError extends Error {}

export type Logger = {
	info: (...messages: Arguments) => void
	warn: (...messages: Arguments) => void
	error: (...messages: Arguments) => void
}

const colorMap = {
	warn: 'yellow',
	error: 'red',
} as const

const colorize = (logLevel: LogLevel, ...messages: string[]) =>
	logLevel === 'info' ? messages : [kleur[colorMap[logLevel]]().bold(messages.join(' '))]

const log = (console: Console, logLevel: LogLevel, ...messages: Arguments) =>
	console[logLevel](...colorize(logLevel, '[typesafe-i18n]', ...messages))

const throwError = (console: Console, logLevel: LogLevel, ...messages: Arguments) => {
	log(console, logLevel, ...messages)
	throw new TypesafeI18nParseError()
}

export const createLogger = (console: Console, throwOnError = false): Logger => ({
	info: log.bind(null, console, 'info'),
	warn: log.bind(null, console, 'warn', 'WARNING:'),
	error: (throwOnError ? throwError : log).bind(null, console, 'error', 'ERROR:'),
})

export const logger = createLogger(console)
