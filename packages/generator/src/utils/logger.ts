import type { Arguments } from '@typesafe-i18n/runtime/core.mjs'
import kleur from 'kleur'

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
