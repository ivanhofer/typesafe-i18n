import { denoRuntime, isDenoProject } from './deno.mjs'
import { isNodeProject, nodeRuntime } from './node.mjs'

export type RuntimeObject = {
	type: 'deno' | 'node'
	install: () => Promise<boolean>
	isEsmProject: () => Promise<boolean>
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
