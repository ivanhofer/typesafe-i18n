// --------------------------------------------------------------------------------------------------------------------
import { diff as justDiff } from 'just-diff'
import justDiffApply from 'just-diff-apply'
import kleur from 'kleur'
import path from 'path'
import prompts from 'prompts'
import type { PackageJson } from 'type-fest'
import { isPropertyNotUndefined } from 'typesafe-utils'
import { importFile } from '../../generator/src/file-utils'
import {
	Adapters,
	GeneratorConfig,
	getConfigWithDefaultValues,
	writeConfigToFile,
} from '../../generator/src/generate-files'
import { logger } from '../../generator/src/generator-util'

// --------------------------------------------------------------------------------------------------------------------

const getAdapterInfo = (allDependencyList: string[]): [Adapters | undefined, boolean] => {
	if (allDependencyList.includes('@angular/core')) {
		return ['angular', true]
	}

	if (allDependencyList.includes('react')) {
		return ['react', true] // TODO: set 'loadLocalesAsync' correctly
	}

	if (allDependencyList.includes('svelte')) {
		return ['svelte', true] // TODO: set 'loadLocalesAsync' correctly
	}

	if (allDependencyList.includes('express') || allDependencyList.includes('fastify')) {
		return ['node', false]
	}

	return [undefined, true]
}

const getDefaultValues = async () => {
	const pck = (await importFile<PackageJson>(path.resolve('package.json'), false)) || ({} as PackageJson)

	const dependencyList = Object.keys(pck.dependencies || {})
	const devDependencyList = Object.keys(pck.devDependencies || {})
	const peerDependencyList = Object.keys(pck.peerDependencies || {})
	const allDependencyList = [...dependencyList, ...devDependencyList, ...peerDependencyList]

	const [adapter, loadLocalesAsync] = getAdapterInfo(allDependencyList)
	const isEsmProject = pck.type === 'module'
	const isTypeScriptProject = allDependencyList.includes('typescript')

	const defaultConfig = await getConfigWithDefaultValues()
	const config: GeneratorConfig = {
		baseLocale: defaultConfig.baseLocale,
		adapter,
		loadLocalesAsync,
		esmImports: isEsmProject,
		outputFormat: isTypeScriptProject ? 'TypeScript' : 'JavaScript',
		outputPath: defaultConfig.outputPath,
	}

	return config
}

// --------------------------------------------------------------------------------------------------------------------

const askQuestions = ({
	baseLocale,
	adapter,
	loadLocalesAsync,
	esmImports,
	outputFormat,
	outputPath,
}: GeneratorConfig) =>
	prompts([
		{
			name: 'baseLocale',
			type: 'text',
			message: 'What is your base locale?',
			initial: baseLocale,
		},
		{
			name: 'adapter',
			type: 'select',
			message: 'What adapter do you want to use?',
			choices: [
				{ title: 'None' },
				{ title: 'Angular', value: 'angular', description: 'this is an Angular application' },
				{ title: 'Node.js', value: 'node', description: 'for Backends, APIs' },
				{ title: 'React', value: 'react', description: 'this is a React/Next.js application' },
				{ title: 'Svelte', value: 'svelte', description: 'this is a Svelte/SvelteKit application' },
			],
			initial: () => {
				switch (adapter) {
					case 'angular':
						return 1
					case 'node':
						return 2
					case 'react':
						return 3
					case 'svelte':
						return 4
					default:
						return 0
				}
			},
			format: (value) => (value === 0 ? undefined : value),
		},
		{
			name: 'loadLocalesAsync',
			type: 'select',
			message: 'Do you want your locales to be loaded asynchronously?',
			choices: [
				{ title: 'No', value: false, description: 'TODO' },
				{ title: 'Yes', value: true, description: 'TODO' },
			],
			initial: loadLocalesAsync === false ? 0 : 1,
		},
		{
			name: 'esmImports',
			type: 'select',
			message: 'Are you using esm modules in your project?',
			choices: [
				{ title: 'No', value: false, description: 'TODO' },
				{ title: 'Yes', value: true, description: 'TODO' },
			],
			initial: esmImports === false ? 0 : 1,
		},
		{
			name: 'outputFormat',
			type: 'select',
			message: 'Are you using TypeScript or JavaScript?',
			choices: [
				{ title: 'TypeScript', value: 'TypeScript', description: `I'm using '.ts' files` },
				{ title: 'JavaScript', value: 'JavaScript', description: 'I want to use JSDoc-annotations' },
			],
			initial: outputFormat === 'TypeScript' ? 0 : 1,
		},
		{
			name: 'outputPath',
			type: 'text',
			message: 'Where do you want your locale files to be located?',
			initial: outputPath,
			validate: (value: string) => value.startsWith('./') || `path must be a relative path and start with './'`,
		},
	])

const getConfigDiff = async (options: GeneratorConfig) => {
	const { baseLocale, adapter, loadLocalesAsync, esmImports, outputFormat, outputPath } =
		await getConfigWithDefaultValues({}, false)

	const diff = justDiff({ baseLocale, adapter, loadLocalesAsync, esmImports, outputFormat, outputPath }, options)

	const changedValues = justDiffApply.diffApply(
		{
			baseLocale: undefined,
			adapter: undefined,
			loadLocalesAsync: undefined,
			esmImports: undefined,
			outputFormat: undefined,
			outputPath: undefined,
		} as GeneratorConfig,
		diff,
	)

	return Object.fromEntries(Object.entries(changedValues).filter(isPropertyNotUndefined('1')))
}

export const setup = async (autoSetup: boolean) => {
	const defaultValues = await getDefaultValues()

	!autoSetup &&
		logger.info(
			kleur.yellow(
				'See this link for more information on how to setup this project: https://github.com/ivanhofer/typesafe-i18n#options',
			),
		)

	const answers: GeneratorConfig = autoSetup ? defaultValues : await askQuestions(defaultValues)
	const options = { ...defaultValues, ...answers }

	const config = await getConfigDiff(options)

	await writeConfigToFile(config)
	logger.info('setup complete')
}
