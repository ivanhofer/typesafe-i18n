import { BaseTranslation } from 'packages/core/src'
import { resolve, sep } from 'path'
import { isTruthy } from 'typesafe-utils'
import ts from 'typescript'
import {
	containsFolders,
	createPathIfNotExits,
	deleteFolderRecursive,
	doesPathExist,
	getDirectoryStructure,
	importFile
} from './file-utils'
import { logger } from './generator-util'
import { fileEnding, shouldGenerateJsDoc } from './output-handler'

/**
 * looks for the location of the compiled 'index.js' file
 * if the 'index.ts' file imports something from outside it's directory, we need to find the correct path to the base location file
 */
const detectLocationOfCompiledBaseTranslation = async (
	outputPath: string,
	locale: string,
	tempPath: string,
): Promise<string> => {
	if (!containsFolders(tempPath)) return ''

	const directory = await getDirectoryStructure(tempPath)

	// contains the path from <root> to base locale file
	const outputPathParts = resolve(outputPath, locale).replace(resolve(), '').split(sep).filter(isTruthy)

	for (let i = 0; i < outputPathParts.length; i++) {
		const part = outputPathParts[i] as string
		const subDirectory = directory[part] as Record<string, unknown> | undefined
		if (subDirectory) {
			let outputPathPartsRest = [...outputPathParts].slice(i + 1)

			let isPathValid = true
			let subDirectoryOfCurrentSection = subDirectory
			const subPaths = [part]
			while (isPathValid && outputPathPartsRest.length) {
				// we need to find the full matching path
				// e.g. `src/path/i18n/en` is invalid if the base locale is located inside `src/i18n/en`
				const subSubDirectoryOfCurrentSection = subDirectoryOfCurrentSection[
					outputPathPartsRest[0] as string
				] as Record<string, unknown>
				if (subSubDirectoryOfCurrentSection) {
					subPaths.push(outputPathPartsRest[0] as string)
					outputPathPartsRest = outputPathPartsRest.slice(1)
					subDirectoryOfCurrentSection = subSubDirectoryOfCurrentSection
				} else {
					isPathValid = false
				}
			}

			if (isPathValid) {
				i += outputPathPartsRest.length
				return [...subPaths, ''].join('/')
			}
		}
	}

	return ''
}

const transpileTypescriptFiles = async (
	outputPath: string,
	languageFilePath: string,
	locale: string,
	tempPath: string,
): Promise<string> => {
	const program = ts.createProgram([languageFilePath], { outDir: tempPath })
	program.emit()

	const baseTranslationPath = await detectLocationOfCompiledBaseTranslation(outputPath, locale, tempPath)

	return resolve(tempPath, `${baseTranslationPath}index.js`)
}

export const parseLanguageFile = async (
	outputPath: string,
	locale: string,
	tempPath: string,
): Promise<BaseTranslation | null> => {
	const originalPath = resolve(outputPath, locale, `index${fileEnding}`)

	if (!(await doesPathExist(originalPath))) {
		logger.info(`could not load base locale file '${locale}'`)
		return null
	}

	!shouldGenerateJsDoc && (await createPathIfNotExits(tempPath))

	const importPath = shouldGenerateJsDoc
		? originalPath
		: await transpileTypescriptFiles(outputPath, originalPath, locale, tempPath)

	if (!importPath) {
		return null
	}

	const languageImport = await importFile<BaseTranslation>(importPath)

	!shouldGenerateJsDoc && (await deleteFolderRecursive(tempPath))

	if (!languageImport) {
		logger.error(`could not read default export from language file '${locale}'`)
		return null
	}

	return languageImport
}
