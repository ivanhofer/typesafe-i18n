import { build } from 'esbuild'
import { readdirSync } from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

//@ts-ignore
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const watch = process.argv.includes('--watch')

const getPath = (file: string) => resolve(__dirname, file)

const files = readdirSync(getPath('src'))

files.forEach((file) => {
	build({
		entryPoints: [getPath(`src/${file}`)],
		bundle: true,
		outfile: getPath(`../../rollup/${file.replace('.ts', '.js')}`),
		platform: 'node',
		external: ['typescript', 'chokidar'],
		format: 'cjs',
		sourcemap: true,
		watch,
		tsconfig: './tsconfig.json',
	}).catch(() => process.exit(1))
})
