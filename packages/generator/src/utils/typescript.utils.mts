// aliased because the esbuild banner of the CLI bundle already declares 'createRequire'
import { createRequire as createNodeRequire } from 'module'
import { resolve } from 'path'
import type ts from 'typescript'
import { parseTypescriptVersion, type TypescriptVersion } from './generator.utils.mjs'
import { logger } from './logger.mjs'

type TypescriptModule = typeof ts

// starting with TypeScript 7 the package's main entry only exposes version information,
// so the module needs to be imported lazily and each API feature-detected before use
const importTypescript = async (): Promise<Partial<TypescriptModule> | undefined> => {
	try {
		const tsModule = (await import('typescript')) as { default?: TypescriptModule } & TypescriptModule
		return tsModule.default ?? tsModule
	} catch (ignore) {
		return undefined
	}
}

let compilerPromise: Promise<TypescriptModule | undefined> | undefined

export const getTypescriptCompiler = (): Promise<TypescriptModule | undefined> =>
	(compilerPromise ??= importTypescript().then((tsModule) =>
		typeof tsModule?.createProgram === 'function' ? (tsModule as TypescriptModule) : undefined,
	))

// resolve from the user's project instead of `import.meta.url`; the importer and exporter
// are also shipped as CJS bundles where `import.meta` is empty
export const createRequireFromProject = () => createNodeRequire(resolve(process.cwd(), 'noop.js'))

const FALLBACK_VERSION: TypescriptVersion = { major: 5, minor: 5 }

const detectTypescriptVersion = async (): Promise<TypescriptVersion> => {
	const tsModule = await importTypescript()
	if (typeof tsModule?.versionMajorMinor === 'string') {
		return parseTypescriptVersion(tsModule.versionMajorMinor)
	}

	try {
		const { version } = createRequireFromProject()('typescript/package.json') as { version?: string }
		if (version) return parseTypescriptVersion(version)
	} catch (ignore) {
		// 'typescript' is not installed
	}

	logger.info(
		`could not detect the installed TypeScript version, assuming version >= ${FALLBACK_VERSION.major}.${FALLBACK_VERSION.minor}`,
	)
	return FALLBACK_VERSION
}

let versionPromise: Promise<TypescriptVersion> | undefined

export const getTypescriptVersion = (): Promise<TypescriptVersion> => (versionPromise ??= detectTypescriptVersion())
