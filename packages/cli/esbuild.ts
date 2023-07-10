/* eslint-disable no-console */
import { context } from 'esbuild'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { nativeNodeModulesPlugin } from './native-node-modules-plugin'

//@ts-ignore
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const watch = process.argv.includes('--watch')

const getPath = (file: string) => resolve(__dirname, file)

const ctx = await context({
	plugins: [nativeNodeModulesPlugin],
	entryPoints: [getPath('src/cli.mts')],
	bundle: true,
	outfile: getPath('../../cli/typesafe-i18n.mjs'),
	platform: 'node',
	external: ['typescript'],
	banner: {
		js: `#!/usr/bin/env node
import { createRequire } from 'module'
global.require = createRequire(import.meta.url)`,
	},
	format: 'esm',
	sourcemap: watch,
	tsconfig: './tsconfig.json',
}).catch(() => process.exit(1))

if (watch) {
	await ctx.watch()
	console.info('👀 watching for changes...')
	process.on('exit', async () => {
		console.info('🙈 process killed')
		await ctx.dispose()
	})
} else {
	await ctx.rebuild()
	console.info('✅ build complete')
	await ctx.dispose()
}
