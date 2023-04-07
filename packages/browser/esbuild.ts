/* eslint-disable no-console */
import { context } from 'esbuild'
import { setMaxListeners } from 'events'

setMaxListeners(30)

const watch = process.argv.includes('--watch')

const files = ['string', 'typed.string', 'object', 'typed.object', 'instance', 'all']

const contexts = await Promise.all(
	files.flatMap((file) =>
		[false, true].map((minify) =>
			context({
				entryPoints: [`./src/browser.${file}.mts`],
				bundle: true,
				outfile: `../../dist/i18n.${file}${minify ? '.min' : ''}.js`,
				platform: 'browser',
				format: 'iife',
				minify: minify,
				sourcemap: watch,
				tsconfig: './tsconfig.json',
			}),
		),
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
