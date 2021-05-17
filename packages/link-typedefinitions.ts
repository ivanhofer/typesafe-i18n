import { readdirSync, writeFileSync } from 'fs'
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
	['rollup-plugin', 'rollup'],
	['webpack-plugin', 'webpack'],
]

mappings.forEach(([fromWheretoImport, outputPath = fromWheretoImport, mapperFunction]) => {
	const files = readdirSync(resolve(__dirname, `../types/${fromWheretoImport}/src`))

	const filteredFiles = (mapperFunction && files.filter(mapperFunction)) || files

	filteredFiles.forEach((file) => {
		writeFileSync(
			resolve(__dirname, `../${outputPath}/${file}`),
			`export * from '../types/${fromWheretoImport}/src/${file.substring(0, file.length - 5)}'`,
			{ encoding: 'utf8' },
		)
	})

	// eslint-disable-next-line no-console
	console.info(`types linked for '${outputPath}'`)
})
