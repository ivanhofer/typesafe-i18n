import { resolve } from 'path'
import type { PackageJson } from 'type-fest'
import { importFile } from '../../../../generator/src/utils/file.utils.mjs'
import { logger } from '../../../../generator/src/utils/logger.mjs'
import type { RuntimeObject } from './index.mjs'

// --------------------------------------------------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let pck: any | undefined = undefined

const denoJsonPath = resolve('deno.json')
const readDenoJson = async () => pck || (pck = await importFile<PackageJson | undefined>(denoJsonPath, false))

export const isDenoProject = async () => !!(await readDenoJson())

// --------------------------------------------------------------------------------------------------------------------

const getDependencyList = async () => {
	// TODO: implement
	return [] as string[]
}

// --------------------------------------------------------------------------------------------------------------------

const install = async (): Promise<boolean> => {
	// TODO: implement
	logger.info(
		`Automatic install of deno dependencies is currently not implemented for 'deno'. See https://github.com/ivanhofer/typesafe-i18n/discussions/87. You have to install 'typesafe-i18n' by yourself.`,
	)

	return false
}

// --------------------------------------------------------------------------------------------------------------------

export const denoRuntime: RuntimeObject = {
	type: 'deno',
	install,
	getEsmImportOption: async () => 'fileEnding',
	getDependencyList,
}
