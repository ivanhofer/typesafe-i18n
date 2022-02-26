import { build } from 'esbuild'
import { resolve } from 'path'
import type { BaseTranslation } from '../../runtime/src'
import type { Locale } from '../../runtime/src/core'
import { fileEnding } from './output-handler'
import { createPathIfNotExits, deleteFolderRecursive, doesPathExist, getFiles, importFile } from './utils/file.utils'
import { logger } from './utils/logger'

const transpileTypescriptFiles = async (languageFilePath: string, tempPath: string): Promise<string> => {
	const outfile = resolve(tempPath, 'index.mjs')

	await build({
		entryPoints: [languageFilePath],
		outfile,
		bundle: true,
		platform: 'node',
		target: 'esnext',
		format: 'esm',
	}).catch(() => void 0)

	return outfile
}

export const parseLanguageFile = async (
	outputPath: string,
	tempPath: string,
	locale: Locale,
	workspace = '',
): Promise<BaseTranslation | null> => {
	const fileName = workspace ? `${locale}/${workspace}` : locale
	const type = workspace ? 'workspace' : 'base locale'

	const originalPath = resolve(outputPath, fileName, `index${fileEnding}`)

	if (!(await doesPathExist(originalPath))) {
		logger.info(`could not load ${type} file '${fileName}'`)
		return null
	}

	await createPathIfNotExits(tempPath)

	const importPath = await transpileTypescriptFiles(originalPath, tempPath)

	if (!importPath) {
		return null
	}

	const languageImport = await importFile<BaseTranslation>(importPath)

	await deleteFolderRecursive(tempPath)

	if (!languageImport) {
		logger.error(`could not read default export from ${type} file '${fileName}'`)
		return null
	}

	return getDefaultExport(languageImport)
}

const getDefaultExport = (languageFile: BaseTranslation): BaseTranslation => {
	const keys = Object.keys(languageFile)
	if (keys.includes('__esModule') || (keys.length === 1 && keys.includes('default'))) {
		return (languageFile as Record<string, BaseTranslation>).default as BaseTranslation
	}

	return languageFile
}

export const getAllLanguages = async (path: string): Promise<string[]> => {
	const files = await getFiles(path, 1)
	return files.filter(({ folder, name }) => folder && name === `index${fileEnding}`).map(({ folder }) => folder)
}
