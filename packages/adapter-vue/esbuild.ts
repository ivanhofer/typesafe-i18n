import { build } from 'esbuild'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const watch = process.argv.includes('--watch')

//@ts-ignore
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const getPath = (file: string) => resolve(__dirname, file)

const formats = ['esm', 'cjs'] as const

formats.forEach((format) =>
	[false, true].forEach((minify) =>
		build({
			entryPoints: [`./src/vue-plugin.ts`],
			bundle: true,
			outfile: getPath(`../../vue/vue-plugin${minify ? '.min' : ''}.${format === 'esm' ? 'm' : 'c'}js`),
			external: ['vue'],
			platform: 'browser',
			format,
			sourcemap: !minify,
			minify,
			watch,
		}).catch(() => process.exit(1)),
	),
)
