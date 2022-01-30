import { build } from 'esbuild'
import globPkg from 'glob'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const { sync: glob } = globPkg

//@ts-ignore
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const watch = process.argv.includes('--watch')

const getPath = (file: string) => resolve(__dirname, file)

const files = glob(resolve(__dirname, `./src/**/*.*ts`))
	.map((file) =>
		resolve(file)
			.substring(resolve(__dirname, `./src/`).length + 1)
			.replace(/\\/g, '/'),
	)
	.filter((file) => !file.split('/').some((part) => part.startsWith('_')))

const formats = ['esm', 'cjs'] as const

files.forEach((file) =>
	formats.forEach((format) =>
		build({
			entryPoints: [getPath(`./src/${file}`)],
			bundle: true,
			outfile: getPath(`../../detectors/${file.replace('.ts', `.${format === 'esm' ? 'm' : 'c'}js`)}`),
			platform: 'browser',
			format,
			minify: true,
			sourcemap: false,
			watch,
			tsconfig: './tsconfig.json',
		}).catch(() => process.exit(1)),
	),
)
