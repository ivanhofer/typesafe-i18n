import { execSync } from 'child_process'
import { keyword } from 'esutils'
import type { Logger } from './logger.mjs'

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

export const runCommandAfterGenerator = (logger: Logger, runAfterGenerator: string) => {
	logger.info(`running command '${runAfterGenerator}'`)

	const output = execSync(runAfterGenerator).toString()
	logger.info(
		'output: \n>\n' +
			output
				.split('\n')
				.map((line) => `> ${line}`)
				.join('\n'),
	)
}
