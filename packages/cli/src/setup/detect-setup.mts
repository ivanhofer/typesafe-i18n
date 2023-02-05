import { resolve } from 'path'
import { getConfigWithDefaultValues } from '../../../config/src/config.mjs'
import type { Adapters, GeneratorConfig } from '../../../config/src/types.mjs'
import { doesPathExist } from '../../../generator/src/utils/file.utils.mjs'
import { getRuntimeObject } from './runtimes/inde.mjs'

const useAdapterWhenDependenciesContain =
	(shouldContain: string[]) =>
	(dependencies: string[]): boolean =>
		// casting needed because of https://github.com/microsoft/TypeScript/issues/46707
		shouldContain.reduce((prev, dep) => prev || dependencies.includes(dep), false as boolean)

const shouldUseAngularAdapter = useAdapterWhenDependenciesContain(['@angular/core'])
const shouldUseReactAdapter = useAdapterWhenDependenciesContain(['react', 'next'])
const shouldUseSolidAdapter = useAdapterWhenDependenciesContain(['solid-js'])
const shouldUseSvelteAdapter = useAdapterWhenDependenciesContain(['svelte', '@sveltejs/kit', 'sapper'])
const shouldUseVueAdapter = useAdapterWhenDependenciesContain(['vue', 'nuxt'])
const shouldUseNodeAdapter = useAdapterWhenDependenciesContain(['express', 'fastify'])

const getAdapterInfo = (deps: string[]): Adapters | undefined => {
	if (shouldUseAngularAdapter(deps)) return 'angular'
	if (shouldUseReactAdapter(deps)) return 'react'
	if (shouldUseSolidAdapter(deps)) return 'solid'
	if (shouldUseSvelteAdapter(deps)) return 'svelte'
	if (shouldUseVueAdapter(deps)) return 'vue'
	if (shouldUseNodeAdapter(deps)) return 'node'

	return undefined
}

// --------------------------------------------------------------------------------------------------------------------

export const getDefaultConfig = async () => {
	const runtime = await getRuntimeObject()
	if (!runtime) return {} as GeneratorConfig

	const dependencies = await runtime.getDependencyList()

	const adapter = getAdapterInfo(dependencies) as Adapters
	const isTypeScriptProject = dependencies.includes('typescript') || (await doesPathExist(resolve('tsconfig.json')))

	// TODO: check if this is still valid
	// vite currently has some SSR issues (https://github.com/vitejs/vite/discussions/4230) so we have to disable esmImports
	const esmImports = (await runtime.isEsmProject()) && adapter !== 'svelte'

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
