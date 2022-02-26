import path from 'path'
import { getConfigWithDefaultValues } from '../../../config/src/config'
import type { Adapters, GeneratorConfig } from '../../../config/src/types'
import { doesPathExist } from '../../../generator/src/utils/file.utils'
import { getDependencyList, isEsmProject } from './package-json'

const useAdapterWhenDependenciesContain =
	(shouldContain: string[]) =>
	(dependencies: string[]): boolean =>
		// casting needed because of https://github.com/microsoft/TypeScript/issues/46707
		shouldContain.reduce((prev, dep) => prev || dependencies.includes(dep), false as boolean)

const shouldUseAngularAdapter = useAdapterWhenDependenciesContain(['@angular/core'])
const shouldUseReactAdapter = useAdapterWhenDependenciesContain(['react', 'next'])
const shouldUseSvelteAdapter = useAdapterWhenDependenciesContain(['svelte', '@sveltejs/kit', 'sapper'])
const shouldUseVueAdapter = useAdapterWhenDependenciesContain(['vue'])
const shouldUseNodeAdapter = useAdapterWhenDependenciesContain(['express', 'fastify'])

const getAdapterInfo = (deps: string[]): Adapters | undefined => {
	if (shouldUseAngularAdapter(deps)) return 'angular'
	if (shouldUseReactAdapter(deps)) return 'react'
	if (shouldUseSvelteAdapter(deps)) return 'svelte'
	if (shouldUseVueAdapter(deps)) return 'vue'
	if (shouldUseNodeAdapter(deps)) return 'node'

	return undefined
}

// --------------------------------------------------------------------------------------------------------------------

export const getDefaultConfig = async () => {
	const dependencies = await getDependencyList()

	const adapter = getAdapterInfo(dependencies)
	const isTypeScriptProject =
		dependencies.includes('typescript') || (await doesPathExist(path.resolve('tsconfig.json')))

	// TODO: check if this is still valid
	// vite currently has some SSR issues (https://github.com/vitejs/vite/discussions/4230) so we have to disable esmImports
	const esmImports = (await isEsmProject()) && adapter !== 'svelte'

	const defaultConfig = await getConfigWithDefaultValues()
	const config: GeneratorConfig = {
		baseLocale: defaultConfig.baseLocale,
		adapter,
		esmImports,
		outputFormat: isTypeScriptProject ? 'TypeScript' : 'JavaScript',
		outputPath: defaultConfig.outputPath,
	}

	return config
}
