import { build } from 'esbuild'
import { resolve } from 'path'

const watch = process.argv.includes('--watch')

const getPath = (file: string) => resolve(__dirname, file)

const formats = ['esm', 'cjs'] as const

formats.forEach((format) =>
	[false, true].forEach((minify) =>
		build({
			entryPoints: ['./src/index.ts'],
			bundle: true,
			outfile: getPath(`../../vue/index${minify ? '.min' : ''}.${format === 'esm' ? 'm' : 'c'}js`),
			external: ['vue'],
			platform: 'browser',
			format,
			sourcemap: watch,
			minify,
			watch,
			tsconfig: './tsconfig.json',
		}).catch(() => process.exit(1)),
	),
)
