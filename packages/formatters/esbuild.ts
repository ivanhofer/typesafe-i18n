import { build } from 'esbuild'
import { readdirSync } from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const watch = process.argv.includes('--watch')

//@ts-ignore
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const getPath = (file: string) => resolve(__dirname, file)

const files = readdirSync(getPath('./src')).filter((file) => !file.startsWith('_'))

const formats = ['esm', 'cjs'] as const

files.forEach((file) =>
	formats.forEach((format) =>
		build({
			entryPoints: [`./src/${file}`],
			bundle: true,
			outfile: getPath(`../../formatters/${file.replace('.mts', `.${format === 'esm' ? 'm' : 'c'}js`)}`),
			platform: 'neutral',
			format,
			minify: true,
			watch,
			tsconfig: './tsconfig.json',
		}).catch(() => process.exit(1)),
	),
)
