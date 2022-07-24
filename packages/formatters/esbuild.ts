import { build } from 'esbuild'
import { readdirSync } from 'fs'
import { resolve } from 'path'

const watch = process.argv.includes('--watch')

const getPath = (file: string) => resolve(__dirname, file)

const files = readdirSync(getPath('./src')).filter((file) => !file.startsWith('_'))

const formats = ['esm', 'cjs'] as const

files.forEach((file) =>
	formats.forEach((format) =>
		build({
			entryPoints: [`./src/${file}`],
			bundle: true,
			outfile: getPath(`../../formatters/${file.replace('.ts', `.${format === 'esm' ? 'm' : 'c'}js`)}`),
			platform: 'neutral',
			format,
			minify: true,
			watch,
			tsconfig: './tsconfig.json',
		}).catch(() => process.exit(1)),
	),
)
