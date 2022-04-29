import { readFileSync, writeFileSync } from 'fs'
import { dirname, resolve } from 'path'
import glob from 'tiny-glob/sync.js'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

type FromWheretoImport = string
type OutputPath = string
type FilterFunction = (file: string) => boolean

const mappings: [FromWheretoImport, OutputPath?, FilterFunction?][] = [
	['adapter-angular', 'angular'],
	['adapter-react', 'react'],
	['adapter-solid', 'solid'],
	['adapter-svelte', 'svelte'],
	['adapter-vue', 'vue'],
	['exporter', 'exporter', (file) => file === 'index.d.ts'],
	['formatters'],
	['importer', 'importer', (file) => file === 'index.d.ts'],
	['detectors'],
	['parser'],
	['parser', 'runtime/cjs/parser/src'],
	['parser', 'runtime/esm/parser/src'],
	['runtime', 'types'],
	['runtime', 'runtime/cjs/runtime/src'],
	['runtime', 'runtime/esm/runtime/src'],
]

const goToRoot = (outputPath: string, file: string) => {
	const goUpXTimes = outputPath.startsWith('runtime') ? 3 : 0
	return new Array(file.split('/').length + goUpXTimes).fill('../').join('')
}

mappings.forEach(([fromWheretoImport, outputPath = fromWheretoImport, mapperFunction]) => {
	const files = glob(`types/${fromWheretoImport}/src/**/*.d.ts`).map((file) =>
		resolve(file)
			.substring(resolve(__dirname, `../types/${fromWheretoImport}/src/`).length + 1)
			.replace(/\\/g, '/'),
	)

	// rewrite all files to link always to the same runtime types
	files.forEach((file) => {
		const fullFilePath = resolve(__dirname, `../types/${fromWheretoImport}/src/${file}`)
		const content = readFileSync(fullFilePath).toString()
		if (content.includes('runtime/src/runtime')) {
			writeFileSync(fullFilePath, content.replace('runtime/src/runtime', 'runtime'), { encoding: 'utf8' })
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
