import { promises as fsPromises } from 'fs'
import { join, resolve } from 'path'

const { readFile, readdir, writeFile, mkdir, stat, copyFile: cp, unlink } = fsPromises

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

export const createPathIfNotExits = async (path: string): Promise<void> => {
	const pathExists = await doesPathExist(path)
	if (!pathExists) {
		mkdir(path, { recursive: true })
	}
}

export const copyFile = async (fromPath: string, toPath: string): Promise<boolean> => {
	try {
		await cp(fromPath, toPath)
		return true
	} catch (_e) {
		return false
	}
}

export const deleteFile = async (path: string): Promise<boolean> => {
	try {
		await unlink(path)
		return true
	} catch (_e) {
		return false
	}
}

export const writeNewFile = async (path: string, file: string, content: string): Promise<void> => {
	await createPathIfNotExits(path)

	writeFile(join(path, file), content, { encoding: 'utf-8' })

	// eslint-disable-next-line no-console
	console.info('[LANGAUGE] generated types')
}

export const updateTypesIfContainsChanges = async (path: string, file: string, types: string): Promise<void> => {
	const oldTypes = await readPrevousFile(join(path, file))
	if (oldTypes === types) return

	await writeNewFile(path, file, types)
}

type GetFilesType = { name: string; folder: string }

export const getFiles = async (path: string, depth = 0): Promise<GetFilesType[]> => {
	const entries = await readdir(path, { withFileTypes: true })

	const files = entries.filter((file) => !file.isDirectory()).map(({ name }) => ({ name, folder: '' }))

	const folders = entries.filter((folder) => folder.isDirectory())

	if (depth) {
		for (const folder of folders)
			files.push(
				...(await getFiles(`${resolve(path, folder.name)}/`, depth - 1)).map((a) => ({
					...a,
					folder: folder.name,
				})),
			)
	}

	return files
}

export const importFile = async <T = unknown>(file: string): Promise<T> =>
	(await import(file).catch(() => null))?.default
