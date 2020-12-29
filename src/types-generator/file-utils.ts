import { promises as fsPromises } from 'fs'
import { join } from 'path'

const { readFile, writeFile, mkdir, stat } = fsPromises

const readPrevousFile = async (file: string): Promise<string> => {
	try {
		return (await readFile(file))?.toString()
	} catch (_e) {
		return ''
	}
}

const doesPathExist = async (path: string): Promise<boolean> => {
	try {
		await stat(path)
		return true
	} catch (_e) {
		return false
	}
}

export const writeNewFile = async (path: string, file: string, content: string): Promise<void> => {
	const pathExists = await doesPathExist(path)
	if (!pathExists) {
		mkdir(path, { recursive: true })
	}

	writeFile(join(path + file), content, { encoding: 'utf-8' })

	// eslint-disable-next-line no-console
	console.info('[LANGAUGE] generated types')
}

export const updateTypesIfContainsChanges = async (path: string, file: string, types: string): Promise<void> => {
	const oldTypes = await readPrevousFile(join(path + file))
	if (oldTypes === types) return

	await writeNewFile(path, file, types)
}
