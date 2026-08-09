/// <reference types="bun" />
import { execFile } from 'child_process'
import { readdir } from 'fs/promises'
import { dirname, resolve, sep } from 'path'
import { isTruthy } from 'typesafe-utils'
import { promisify } from 'util'
import type { OutputFormats } from '../../config/src/types.mjs'
import type { Locale } from '../../runtime/src/core.mjs'
import type { BaseTranslation } from '../../runtime/src/index.mjs'
import { fileEnding } from './output-handler.mjs'
import {
	containsFolders,
	createPathIfNotExits,
	deleteFolderRecursive,
	doesPathExist,
	getDirectoryStructure,
	importFile,
} from './utils/file.utils.mjs'
import { logger } from './utils/logger.mjs'
import { createRequireFromProject, getTypescriptCompiler } from './utils/typescript.utils.mjs'

/**
 * looks for the location of the compiled 'index.js' file
 * if the 'index.ts' file imports something from outside it's directory, we need to find the correct path to the base location file
 */
const detectLocationOfCompiledBaseTranslation = async (
	outputPath: string,
	outputFormat: OutputFormats,
	locale: string,
	tempPath: string,
	typesFileName: string,
): Promise<string> => {
	if (!(await containsFolders(tempPath))) return ''

	const directory = await getDirectoryStructure(tempPath)

	if (outputFormat === 'TypeScript' && !Object.keys(directory).length) {
		logger.error(`in '${locale}'
Make sure to import the type 'BaseTranslation' from the generated '${typesFileName}${fileEnding}' file.
See the example in the official docs: https://github.com/ivanhofer/typesafe-i18n/tree/main/packages/generator#namespaces
`)
	}

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

const getBunRuntime = (): typeof Bun | undefined => (process.versions.bun ? globalThis.Bun : undefined)

const transpileWithBun = async (bun: typeof Bun, languageFilePath: string, tempPath: string): Promise<string> => {
	try {
		const result = await bun.build({
			entrypoints: [languageFilePath],
			outdir: tempPath,
			target: 'bun',
			format: 'esm',
			// npm imports stay external; Bun resolves them when the bundle gets imported
			packages: 'external',
			sourcemap: 'none',
		})

		const outputPath = result.outputs[0]?.path
		if (!result.success || !outputPath) {
			logger.error(`could not transpile file '${languageFilePath}'`, ...result.logs)
			return ''
		}

		return outputPath
	} catch (error) {
		// Bun >= 1.2 throws an 'AggregateError' instead of returning 'success: false'
		logger.error(`could not transpile file '${languageFilePath}'`, error)
		return ''
	}
}

const execFileAsync = promisify(execFile)

const findTscExecutable = (): string | undefined => {
	try {
		const require = createRequireFromProject()
		const packageJsonPath = require.resolve('typescript/package.json')
		const { bin } = require('typescript/package.json') as { bin?: Record<string, string> }
		const binEntry = bin?.['tsc']

		return binEntry ? resolve(dirname(packageJsonPath), binEntry) : undefined
	} catch (ignore) {
		return undefined
	}
}

const transpileWithTscCli = async (languageFilePath: string, tempPath: string): Promise<boolean> => {
	const tscPath = findTscExecutable()
	if (!tscPath) return false

	// 'tsc' emits even when it reports type-errors (guaranteed because of '--noLib'),
	// so a non-zero exit code gets ignored; the output is only kept for the failure log
	let output = ''
	await execFileAsync(
		process.execPath,
		[
			tscPath,
			languageFilePath,
			// a 'tsconfig.json' next to the project would otherwise abort the compilation with
			// 'error TS5112'; the flag only exists in TypeScript >= 7, which is the only version
			// this code path runs for (older versions provide the compiler API instead)
			'--ignoreConfig',
			'--outDir',
			tempPath,
			'--allowJs',
			'--resolveJsonModule',
			'--skipLibCheck',
			'--noLib',
			'--module',
			'commonjs',
			'--target',
			'es2018',
			'--pretty',
			'false',
		],
		{ cwd: resolve() },
	).catch((error: { stdout?: string; stderr?: string }) => (output = `${error.stdout || ''}${error.stderr || ''}`))

	const emittedFiles = await readdir(tempPath).catch(() => [])
	if (!emittedFiles.length) {
		output && logger.error(`running 'tsc' failed with: ${output}`)
		return false
	}

	return true
}

const transpileTypescriptFiles = async (
	outputPath: string,
	outputFormat: OutputFormats,
	languageFilePath: string,
	locale: string,
	tempPath: string,
	typesFileName: string,
): Promise<string> => {
	const bun = getBunRuntime()
	if (bun) {
		// Bun bundles the file and its imports natively; no 'typescript' installation needed
		return transpileWithBun(bun, languageFilePath, tempPath)
	}

	const ts = await getTypescriptCompiler()
	if (ts) {
		const program = ts.createProgram([languageFilePath], {
			outDir: tempPath,
			allowJs: true,
			resolveJsonModule: true,
			skipLibCheck: true,
			sourceMap: false,
			noLib: true,
		})

		program.emit()
	} else if (!(await transpileWithTscCli(languageFilePath, tempPath))) {
		logger.error(`could not transpile file '${languageFilePath}'.
No usable TypeScript compiler was found: either no 'typescript' package is installed, or the installed version does not provide the compiler API (TypeScript >= 7 removed it) and running its 'tsc' CLI failed.
Make sure 'typescript' is installed in your project, or run typesafe-i18n with Bun ('bunx --bun typesafe-i18n').
`)
		return ''
	}

	const baseTranslationPath = await detectLocationOfCompiledBaseTranslation(
		outputPath,
		outputFormat,
		locale,
		tempPath,
		typesFileName,
	)

	return resolve(tempPath, baseTranslationPath, 'index.js')
}

export const parseLanguageFile = async (
	outputPath: string,
	outputFormat: OutputFormats,
	typesFileName: string,
	tempPath: string,
	locale: Locale,
	namespace = '',
): Promise<BaseTranslation | null> => {
	const fileName = namespace ? `${locale}/${namespace}` : locale
	const type = namespace ? 'namespace' : 'base locale'

	const originalPath = resolve(outputPath, fileName, `index${fileEnding}`)

	if (!(await doesPathExist(originalPath))) {
		logger.info(`could not load ${type} file '${fileName}'`)
		return null
	}

	if (outputFormat === 'JavaScript' && namespace) {
		tempPath = `${tempPath}-${namespace}`
	}

	await createPathIfNotExits(tempPath)

	const importPath = await transpileTypescriptFiles(
		outputPath,
		outputFormat,
		originalPath,
		fileName,
		tempPath,
		typesFileName,
	)

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
