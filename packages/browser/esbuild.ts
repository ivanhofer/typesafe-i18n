import { build } from 'esbuild'

const watch = process.argv.includes('--watch')

const files = ['instance', 'string', 'object', 'all']

files.forEach((file) =>
	[false, true].forEach((minify) =>
		build({
			entryPoints: [`./src/browser.${file}.ts`],
			bundle: true,
			outfile: `../../dist/i18n.${file}${minify ? '.min' : ''}.js`,
			platform: 'browser',
			format: 'iife',
			minify: minify,
			sourcemap: watch,
			watch,
			tsconfig: './tsconfig.json',
		}).catch(() => process.exit(1)),
	),
)
