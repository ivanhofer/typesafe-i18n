/* eslint-disable no-console */
import { context } from 'esbuild'
import { setMaxListeners } from 'events'
import { readdirSync } from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

setMaxListeners(30)

const watch = process.argv.includes('--watch')

//@ts-ignore
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const getPath = (file: string) => resolve(__dirname, file)

const files = readdirSync(getPath('./src')).filter((file) => !file.startsWith('_') && !file.includes('.test.'))

const formats = ['esm', 'cjs'] as const

const contexts = await Promise.all(
	files.flatMap((file) =>
		formats.map((format) =>
			context({
				entryPoints: [`./src/${file}`],
				bundle: true,
				outfile: getPath(`../../formatters/${file.replace('.mts', `.${format === 'esm' ? 'm' : 'c'}js`)}`),
				platform: 'neutral',
				format,
				minify: true,
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
