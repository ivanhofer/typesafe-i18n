import { build } from 'esbuild'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const watch = process.argv.includes('--watch')

//@ts-ignore
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const getPath = (file: string) => resolve(__dirname, file)

const files = ['react', 'svelte', 'vue']

const formats = ['esm', 'cjs'] as const

files.forEach((file) =>
	formats.forEach((format) =>
		build({
			entryPoints: [getPath(`src/adapter-${file}.ts`)],
			bundle: true,
			outfile: getPath(`../../adapters/adapter-${file}.${format === 'esm' ? 'm' : 'c'}js`),
			external: [file],
			platform: 'browser',
			format,
			minify: true,
			sourcemap: true,
			watch,
		}).catch(() => process.exit(1)),
	),
)
