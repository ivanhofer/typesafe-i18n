import { promises as fsPromises } from 'fs'
import { dirname, join, resolve } from 'path'
import type { JsonObject } from 'type-fest'
import { pathToFileURL } from 'url'
import { logger } from './generator-util'
import { fileEnding } from './output-handler'

const { readFile: read, readdir, writeFile: write, mkdir, stat, rm } = fsPromises

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

export const deleteFolderRecursive = async (path: string): Promise<boolean> => {
	try {
		await rm(path, { recursive: true })
		return true
	} catch (e) {
		logger.error(`deleteFolderRecursive: ${path}`, e)
		return false
	}
}

export const writeFile = (filePath: string, content: string) => write(filePath, content, { encoding: 'utf-8' })

export const writeConfigFile = async (content: JsonObject) =>
	writeFile(resolve('./', '.typesafe-i18n.json'), JSON.stringify(content, undefined, 3))

const getFileName = (path: string, file: string) => {
	const ext = file.endsWith(fileEnding) || file.endsWith(`${fileEnding}x`) || file.endsWith('.d.ts') ? '' : fileEnding
	return join(path, `${file}${ext}`)
}

export const writeNewFile = async (path: string, file: string, content: string): Promise<void> => {
	await createPathIfNotExits(path)

	writeFile(getFileName(path, file), content)

	logger.info(`generated file: '${path}/${file}'`)
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

export const containsFolders = async (path: string): Promise<boolean> => {
	const entries = await readdir(path, { withFileTypes: true })

	return entries.some((folder) => folder.isDirectory())
}

export const getDirectoryStructure = async (path: string): Promise<Record<string, unknown>> => {
	const entries = await readdir(path, { withFileTypes: true })
	const folders = entries.filter((folder) => folder.isDirectory())

	const promises = folders.map(
		({ name }) =>
			new Promise<[string, Record<string, unknown>]>((r) =>
				getDirectoryStructure(resolve(path, name)).then((x) => r([name, x])),
			),
	)

	return Object.fromEntries(await Promise.all(promises))
}

const isWindows = process.platform === 'win32'
const isEsm = (import.meta.url || '').endsWith('.mjs')

export const importFile = async <T = unknown>(file: string, outputError = true): Promise<T> => {
	if (file.endsWith('.json')) {
		const jsonFile = await readFile(file)
		return jsonFile ? JSON.parse(jsonFile) : undefined
	}

	const importPath = isWindows && isEsm ? pathToFileURL(file).href : file
	return (
		await import(importPath).catch((e) => {
			outputError && logger.error(`import failed for ${importPath}`, e)
			return null
		})
	)?.default
}
