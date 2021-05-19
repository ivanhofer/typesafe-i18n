import { promises as fsPromises } from 'fs'
import { join, resolve, dirname } from 'path'
import { logger } from './generator-util'

const { readFile: read, readdir, writeFile, mkdir, stat, copyFile: cp, rmdir } = fsPromises

// --------------------------------------------------------------------------------------------------------------------
// types --------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------

type GetFilesType = { name: string; folder: string }

// --------------------------------------------------------------------------------------------------------------------
// implementation -----------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------

export const readFile = async (file: string, createPath = false): Promise<string> => {
	try {
		if (createPath) {
			await createPathIfNotExits(resolve(dirname(file)))
		}
		return (await read(file))?.toString()
	} catch (_e) {
		return createPath ? '' : readFile(file, true)
	}
}

export const doesPathExist = async (path: string): Promise<boolean> => {
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
		logger.error(`createPath: ${path}`, e)
		return false
	}
}

export const createPathIfNotExits = async (path: string): Promise<void> => {
	const pathExists = await doesPathExist(path)
	if (!pathExists) {
		await createPath(path)
	}
}

export const copyFile = async (fromPath: string, toPath: string, showError = true): Promise<boolean> => {
	try {
		await cp(fromPath, toPath)
		return true
	} catch (e) {
		showError && logger.error(`copyFile: ${fromPath} - ${toPath}`, e)
		return false
	}
}

export const deleteFolderRecursive = async (path: string): Promise<boolean> => {
	try {
		await rmdir(path, { recursive: true })
		return true
	} catch (e) {
		logger.error(`deleteFolderRecursive: ${path}`, e)
		return false
	}
}

const getFileName = (path: string, file: string) => {
	const ext = file.endsWith('.ts') || file.endsWith('.tsx') ? '' : '.ts'
	return join(path, file + ext)
}

export const writeNewFile = async (path: string, file: string, content: string): Promise<void> => {
	await createPathIfNotExits(path)

	writeFile(getFileName(path, file), content, { encoding: 'utf-8' })

	logger.info(`generated file: ${file}`)
}

export const writeFileIfContainsChanges = async (path: string, file: string, content: string): Promise<void> => {
	const oldContent = await readFile(getFileName(path, file))

	if (oldContent === content) return

	await writeNewFile(path, file, content)
}

export const writeFileIfNotExists = async (path: string, file: string, content: string): Promise<void> => {
	if (await doesPathExist(getFileName(path, file))) return

	await writeNewFile(path, file, content)
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

export const importFile = async <T = unknown>(file: string, outputError = true): Promise<T> =>
	(
		await import(file).catch((e) => {
			outputError && logger.error(`import failed for ${file}`, e)
			return null
		})
	)?.default
