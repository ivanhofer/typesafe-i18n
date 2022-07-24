import { build } from 'esbuild'
import { resolve } from 'path'
import glob from 'tiny-glob/sync.js'

const watch = process.argv.includes('--watch')

const getPath = (file: string) => resolve(__dirname, file)

const files = glob('./src/**/*.*ts')
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
			sourcemap: watch,
			watch,
			tsconfig: './tsconfig.json',
		}).catch(() => process.exit(1)),
	),
)
