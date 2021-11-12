import { readFileSync, writeFileSync } from 'fs'
import { sync as glob } from 'glob'
import { resolve } from 'path'

type FromWheretoImport = string
type OutputPath = string
type FilterFunction = (file: string) => boolean

const mappings: [FromWheretoImport, OutputPath?, FilterFunction?][] = [
	['adapters'],
	['adapter-angular', 'angular', (file) => file === 'angular-service.d.ts'],
	['adapter-react', 'react', (file) => file === 'react-context.d.ts'],
	['adapter-svelte', 'svelte', (file) => file === 'svelte-store.d.ts'],
	['adapter-vue', 'vue', (file) => file === 'vue-adapter.d.ts'], // TODO
	['core', 'cjs'],
	['core', 'esm'],
	['exporter', 'exporter', (file) => file === 'index.d.ts'],
	['formatters'],
	['importer', 'importer', (file) => file === 'index.d.ts'],
	['locale-detector', 'detectors'],
	['parser'],
	['parser', 'runtime/cjs/parser/src'],
	['parser', 'runtime/esm/parser/src'],
	['rollup-plugin', 'rollup'],
	['runtime', 'types'],
	['runtime', 'runtime/cjs/runtime/src'],
	['runtime', 'runtime/esm/runtime/src'],
	['webpack-plugin', 'webpack'],
]

const goToRoot = (outputPath: string, file: string) => {
	const goUpXTimes = outputPath.startsWith('runtime') ? 3 : 0
	return new Array(file.split('/').length + goUpXTimes).fill('../').join('')
}

mappings.forEach(([fromWheretoImport, outputPath = fromWheretoImport, mapperFunction]) => {
	const files = glob(resolve(__dirname, `../types/${fromWheretoImport}/src/**/*.d.ts`)).map((file) =>
		resolve(file)
			.substring(resolve(__dirname, `../types/${fromWheretoImport}/src/`).length + 1)
			.replace(/\\/g, '/'),
	)

	// rewrite all files to link always to the same core types
	files.forEach((file) => {
		const fullFilePath = resolve(__dirname, `../types/${fromWheretoImport}/src/${file}`)
		const content = readFileSync(fullFilePath).toString()
		if (content.includes('runtime/src/core')) {
			writeFileSync(fullFilePath, content.replace('runtime/src/core', 'core'), { encoding: 'utf8' })
		}
	})

	// link generated files to types
	const filteredFiles = (mapperFunction && files.filter(mapperFunction)) || files

	filteredFiles.forEach((file) => {
		const fileName = file.substring(0, file.length - 5)

		writeFileSync(
			resolve(__dirname, `../${outputPath}/${file}`),
			`export * from '${goToRoot(outputPath, file)}types/${fromWheretoImport}/src/${fileName}'`,
			{ encoding: 'utf8' },
		)
	})

	// eslint-disable-next-line no-console
	console.info(`types linked for '${outputPath}'`)
})
