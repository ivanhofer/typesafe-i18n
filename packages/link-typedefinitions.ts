import { readFileSync, writeFileSync } from 'fs'
import { sync as glob } from 'glob'
import { resolve } from 'path'

type FromWheretoImport = string
type OutputPath = string
type FilterFunction = (file: string) => boolean

const mappings: [FromWheretoImport, OutputPath?, FilterFunction?, boolean?][] = [
	['adapters'],
	['adapter-svelte', 'svelte', (file) => file === 'svelte-store.d.ts', true],
	['adapter-react', 'react', (file) => file === 'react-context.d.ts', true],
	['core', 'cjs'],
	['core', 'esm'],
	['formatters'],
	['locale-detector', 'detectors', (file) => file !== 'index.d.ts'],
	['rollup-plugin', 'rollup'],
	['webpack-plugin', 'webpack'],
]

const goToRoot = (file: string) => new Array(file.split('/').length).fill('../').join('')

mappings.forEach(([fromWheretoImport, outputPath = fromWheretoImport, mapperFunction, esmAndCjsOutput = false]) => {
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
	let filteredFiles = (mapperFunction && files.filter(mapperFunction)) || files

	if (esmAndCjsOutput) {
		filteredFiles = filteredFiles
			.flatMap(file => [file.replace('.d.ts', '.esm.d.ts'), file.replace('.d.ts', '.cjs.d.ts')])
	}

	filteredFiles.forEach((file) => {
		let fileName = file.substring(0, file.length - 5)
		if (esmAndCjsOutput) {
			if (fileName.endsWith(".esm") || fileName.endsWith(".cjs")) {
				fileName = fileName.substring(0, fileName.length - 4)
			}
		}

		writeFileSync(
			resolve(__dirname, `../${outputPath}/${file}`),
			`export * from '${goToRoot(file)}types/${fromWheretoImport}/src/${fileName}'`,
			{ encoding: 'utf8' },
		)
	})

	// eslint-disable-next-line no-console
	console.info(`types linked for '${outputPath}'`)
})
