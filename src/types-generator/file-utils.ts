import { promises as fsPromises } from 'fs'
import { join, resolve } from 'path'

const { readFile: read, readdir, writeFile, mkdir, stat, copyFile: cp, rmdir } = fsPromises

// --------------------------------------------------------------------------------------------------------------------
// types --------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------

type GetFilesType = { name: string; folder: string }

// --------------------------------------------------------------------------------------------------------------------
// implementation -----------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------

export const readFile = async (file: string): Promise<string> => {
	try {
		return (await read(file))?.toString()
	} catch (_e) {
		// eslint-disable-next-line no-console
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

const createPath = async (path: string): Promise<boolean> => {
	try {
		await mkdir(path, { recursive: true })
		return true
	} catch (e) {
		// eslint-disable-next-line no-console
		console.error(`[LANGAUGE] ERROR createPath: ${path}`, e)
		return false
	}
}

export const createPathIfNotExits = async (path: string): Promise<void> => {
	const pathExists = await doesPathExist(path)
	if (!pathExists) {
		await createPath(path)
	}
}

export const copyFile = async (fromPath: string, toPath: string): Promise<boolean> => {
	try {
		await cp(fromPath, toPath)
		return true
	} catch (e) {
		// eslint-disable-next-line no-console
		console.error(`[LANGAUGE] ERROR copyFile: ${fromPath} - ${toPath}`, e)
		return false
	}
}

export const deleteFolderRecursive = async (path: string): Promise<boolean> => {
	try {
		await rmdir(path, { recursive: true })
		return true
	} catch (e) {
		// eslint-disable-next-line no-console
		console.error(`[LANGAUGE] ERROR deleteFolderRecursive: ${path}`, e)
		return false
	}
}

export const writeNewFile = async (path: string, file: string, content: string): Promise<void> => {
	await createPathIfNotExits(path)

	writeFile(join(path, file), content, { encoding: 'utf-8' })

	// eslint-disable-next-line no-console
	console.info('[LANGAUGE] generated types')
}

export const writeFileIfContainsChanges = async (path: string, file: string, types: string): Promise<void> => {
	const oldTypes = await readFile(join(path, file))
	if (oldTypes === types) return

	await writeNewFile(path, file, types)
}

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

export const importFile = async <T = unknown>(file: string, outputError = true): Promise<T> => {
	return (
		await import(file).catch((e) => {
			// eslint-disable-next-line no-console
			outputError && console.error('[LANGAUGE] ERROR: import failed ', e)
			return null
		})
	)?.default
}
