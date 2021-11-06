import { doesPathExist } from 'packages/generator/src/file-utils'
import { Adapters, GeneratorConfig, getConfigWithDefaultValues } from 'packages/generator/src/generate-files'
import path from 'path'
import { isBoolean } from 'typesafe-utils'
import { getDependencyList, isEsmProject } from './package-json'

const useAdapter =
	(syncDependencies: string[], asyncDependencies: string[] | false = false) =>
	(dependencies: string[]): [boolean, boolean] => {
		const useAsync = isBoolean(asyncDependencies)
			? asyncDependencies
			: asyncDependencies.reduce((prev, dep) => prev || dependencies.includes(dep), false)

		const use =
			useAsync ||
			// casting needed because of https://github.com/microsoft/TypeScript/issues/46707
			(syncDependencies.reduce((prev, dep) => prev || dependencies.includes(dep), false) as unknown as boolean)

		return [use, useAsync]
	}

const useAngularAdapter = useAdapter([], ['@angular/core'])

const useReactAdapter = useAdapter([], ['react', 'next'])

const useSvelteAdapter = useAdapter(['svelte'], ['@sveltejs/kit', 'sapper'])

const useNodeAdapter = useAdapter(['express', 'fastify'])

const getAdapterInfo = (deps: string[]): [Adapters | undefined, boolean] => {
	const [useAngular, useAngularAsync] = useAngularAdapter(deps)
	if (useAngular) {
		return ['angular', useAngularAsync]
	}

	const [useReact, useReactAsync] = useReactAdapter(deps)
	if (useReact) {
		return ['react', useReactAsync]
	}

	const [useSvelte, useSvelteAsync] = useSvelteAdapter(deps)
	if (useSvelte) {
		return ['svelte', useSvelteAsync]
	}

	const [useNode, useNodeAsync] = useNodeAdapter(deps)
	if (useNode) {
		return ['node', useNodeAsync]
	}

	return [undefined, true]
}

// --------------------------------------------------------------------------------------------------------------------

export const getDefaultConfig = async () => {
	const dependencies = await getDependencyList()

	const [adapter, loadLocalesAsync] = getAdapterInfo(dependencies)
	const isTypeScriptProject =
		dependencies.includes('typescript') || (await doesPathExist(path.resolve('tsconfig.json')))

	// vite currently has some SSR issues (https://github.com/vitejs/vite/discussions/4230) so we have to disable esmImports
	const esmImports = (await isEsmProject()) && adapter !== 'svelte'

	const defaultConfig = await getConfigWithDefaultValues()
	const config: GeneratorConfig = {
		baseLocale: defaultConfig.baseLocale,
		adapter,
		loadLocalesAsync,
		esmImports,
		outputFormat: isTypeScriptProject ? 'TypeScript' : 'JavaScript',
		outputPath: defaultConfig.outputPath,
	}

	return config
}
