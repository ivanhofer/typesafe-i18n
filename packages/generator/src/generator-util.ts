import { keyword } from 'esutils'
import kleur from 'kleur'
import type { Arguments } from '../../runtime/src/core'

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

export const sanitizePath = <Type extends string>(part: Type): Type => part.replace(/[-\s]/g, '_') as Type

export const wrapObjectKeyIfNeeded = (key: string) =>
	keyword.isIdentifierES6(key, true) ? key : `'${key.replace(/'/g, "\\'")}'`

export const prettify = (content: string): string =>
	content
		.replace(/^(\n)+/, '') // remove all new-lines on top of the file
		.replace(/\n\n+/g, '\n\n') // remove multiple new-lines
		.replace(/(\n)+$/, '\n') // remove all multiple trailing new-lines
		.replace(/\t\n/g, '\n') // remove all tabs at the and of a line

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
