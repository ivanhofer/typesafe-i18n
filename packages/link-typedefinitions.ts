import { readFileSync, writeFileSync } from 'fs'
import { sync as glob } from 'glob'
import { resolve } from 'path'

type FromWheretoImport = string
type OutputPath = string
type FilterFunction = (file: string) => boolean

const mappings: [FromWheretoImport, OutputPath?, FilterFunction?][] = [
	['adapters'],
	['adapter-svelte', 'svelte', (file) => file === 'svelte-store.d.ts'],
	['adapter-react', 'react', (file) => file === 'react-context.d.ts'],
	['core', 'cjs'],
	['core', 'esm'],
	['formatters'],
	['locale-detector', 'detectors'],
	['rollup-plugin', 'rollup'],
	['webpack-plugin', 'webpack'],
]

const goToRoot = (file: string) => new Array(file.split('/').length).fill('../').join('')

mappings.forEach(([fromWheretoImport, outputPath = fromWheretoImport, mapperFunction]) => {
	const files = glob(resolve(__dirname, `../types/${fromWheretoImport}/src/**/*.d.ts`)).map((file) =>
		resolve(file)
			.substring(resolve(__dirname, `../types/${fromWheretoImport}/src/`).length + 1)
			.replace(/\\/g, '/'),
	)

	// rewrite all files to link always to the same core types
	files.forEach(file => {
		const fullFilePath = resolve(__dirname, `../types/${fromWheretoImport}/src/${file}`)
		const content = readFileSync(fullFilePath).toString()
		if (content.includes("core/src/core")) {
			writeFileSync(
				fullFilePath,
				content.replace('core/src/core', 'core'),
				{ encoding: 'utf8' },
			)
		}
	})


	// link generated files to types
	const filteredFiles = (mapperFunction && files.filter(mapperFunction)) || files
	filteredFiles.forEach((file) => {
		writeFileSync(
			resolve(__dirname, `../${outputPath}/${file}`),
			`export * from '${goToRoot(file)}types/${fromWheretoImport}/src/${file.substring(0, file.length - 5)}'`,
			{ encoding: 'utf8' },
		)
	})

	// eslint-disable-next-line no-console
	console.info(`types linked for '${outputPath}'`)
})
