import { resolve } from 'path'
import type { PackageJson } from 'type-fest'
import { importFile } from '../../../../generator/src/utils/file.utils.mjs'

// --------------------------------------------------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let pck: any | undefined = undefined

const denoJsonPath = resolve('deno.json')
const readDenoJson = async () => pck || (pck = await importFile<PackageJson | undefined>(denoJsonPath, false))

export const isDenoProject = async () => !!(await readDenoJson())
