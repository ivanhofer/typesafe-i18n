import prompts from 'prompts'
import type { GeneratorConfig } from '../../../config/src/config'

export const askConfigQuestions = ({
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
				{ title: 'No', value: false, description: 'Load all locales into memory at start of application' },
				{ title: 'Yes', value: true, description: 'lazy-load locales as soon as they are needed' },
			],
			initial: loadLocalesAsync === false ? 0 : 1,
		},
		{
			name: 'esmImports',
			type: 'select',
			message: 'Are you using esm modules in your project?',
			choices: [
				{
					title: 'No / not sure',
					value: false,
					description: 'resolves module paths via Node.js resolution schemantics',
				},
				{ title: 'Yes', value: true, description: `requires modules to be imported via '.js' extension` },
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

// --------------------------------------------------------------------------------------------------------------------

export const askOverrideQuestion = () =>
	prompts({
		name: 'override',
		type: 'select',
		message: `Config file '.typesafe-i18n.json' exists already. Do you want to override it?`,
		choices: [
			{ title: 'No', value: false },
			{ title: 'Yes', value: true },
		],
		initial: 0,
	})
