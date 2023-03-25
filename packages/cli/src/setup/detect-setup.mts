import { resolve } from 'path'
import { getConfigWithDefaultValues } from '../../../config/src/config.mjs'
import type { Adapters, GeneratorConfig } from '../../../config/src/types.mjs'
import { doesPathExist } from '../../../generator/src/utils/file.utils.mjs'
import { getRuntimeObject, type RuntimeObject } from './runtimes/index.mjs'

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

const getAdaptersInfo = (type: RuntimeObject['type'], deps: string[]): Adapters[] => {
	const adapters: Adapters[] = []

	if (shouldUseAngularAdapter(deps)) adapters.push('angular')
	if (shouldUseReactAdapter(deps)) adapters.push('react')
	if (shouldUseSolidAdapter(deps)) adapters.push('solid')
	if (shouldUseSvelteAdapter(deps)) adapters.push('svelte')
	if (shouldUseVueAdapter(deps)) adapters.push('vue')
	if (shouldUseNodeAdapter(deps)) adapters.push('node')
	if (type === 'deno') adapters.push('deno')

	return adapters
}

// --------------------------------------------------------------------------------------------------------------------

export const getDefaultConfig = async () => {
	const runtime = await getRuntimeObject()
	if (!runtime) return {} as GeneratorConfig

	const dependencies = await runtime.getDependencyList()

	const adapters = getAdaptersInfo(runtime.type, dependencies)
	const isTypeScriptProject = dependencies.includes('typescript') || (await doesPathExist(resolve('tsconfig.json')))

	// TODO: check if this is still valid
	// vite currently has some SSR issues (https://github.com/vitejs/vite/discussions/4230) so we have to disable esmImports
	const esmImports = (await runtime.getEsmImportOption()) && !adapters.includes('svelte')

	const defaultConfig = await getConfigWithDefaultValues()
	const config: GeneratorConfig = {
		baseLocale: defaultConfig.baseLocale,
		...(adapters ? (adapters.length === 1 ? { adapter: adapters[0] as Adapters } : { adapters }) : {}),
		esmImports,
		outputFormat: isTypeScriptProject ? 'TypeScript' : 'JavaScript',
		outputPath: defaultConfig.outputPath,
	}

	return config
}
