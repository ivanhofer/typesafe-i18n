import type { EsmImportsOption } from 'packages/config/src/types.mjs'
import { denoRuntime, isDenoProject } from './deno.mjs'
import { isNodeProject, nodeRuntime } from './node.mjs'

export type RuntimeObject = {
	type: 'deno' | 'node'
	install: () => Promise<boolean>
	getEsmImportOption: () => Promise<EsmImportsOption>
	getDependencyList: () => Promise<string[]>
}

export const getRuntimeObject = async (): Promise<RuntimeObject | undefined> => {
	if (await isNodeProject()) {
		return nodeRuntime
	} else if (await isDenoProject()) {
		return denoRuntime
	}

	return undefined
}
