import prompts from 'prompts'
import { GeneratorConfig } from '../../../generator/src/generate-files'

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
