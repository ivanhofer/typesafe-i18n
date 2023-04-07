/* eslint-disable no-console */
import { context } from 'esbuild'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

//@ts-ignore
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const watch = process.argv.includes('--watch')

const getPath = (file: string) => resolve(__dirname, file)

const formats = ['esm', 'cjs'] as const

const contexts = await Promise.all(
	formats.map((format) =>
		context({
			entryPoints: [getPath('src/index.mts')],
			bundle: true,
			outfile: getPath(`../../importer/index.${format === 'esm' ? 'm' : 'c'}js`),
			platform: 'node',
			external: ['typescript'],
			banner:
				format === 'esm'
					? {
							js: `
import { createRequire } from 'module'
global.require = createRequire(import.meta.url)`,
					  }
					: {},
			format,
			sourcemap: watch,
			tsconfig: './tsconfig.json',
		}),
	),
)

for (const ctx of contexts) {
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
}
