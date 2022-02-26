import { build } from 'esbuild'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

//@ts-ignore
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const watch = process.argv.includes('--watch')

const getPath = (file: string) => resolve(__dirname, file)

build({
	entryPoints: [getPath(`src/webpack-plugin-typesafe-i18n.ts`)],
	bundle: true,
	outfile: getPath('../../webpack/webpack-plugin-typesafe-i18n.js'),
	platform: 'node',
	external: ['typescript', 'chokidar', 'esbuild'],
	format: 'cjs',
	sourcemap: watch,
	watch,
	tsconfig: './tsconfig.json',
}).catch(() => process.exit(1))
