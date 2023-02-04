import { build } from 'esbuild'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

//@ts-ignore
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const watch = process.argv.includes('--watch')

const getPath = (file: string) => resolve(__dirname, file)

const formats = ['esm', 'cjs'] as const

formats.forEach((format) => {
	build({
		entryPoints: [getPath('src/index.mts')],
		bundle: true,
		outfile: getPath(`../../utils/index.${format === 'esm' ? 'm' : 'c'}js`),
		platform: 'node',
		external: ['typescript'],
		banner:
			format === 'esm'
				? {
						js: `
import { createRequire } from 'module'
global.require = createRequire(import.meta.url)

import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)`,
				  }
				: {},
		format,
		sourcemap: watch,
		watch,
		tsconfig: './tsconfig.json',
	}).catch(() => process.exit(1))
})
