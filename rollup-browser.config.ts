import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import { terser } from 'rollup-plugin-terser'

const ts = typescript()

const config = [
	{
		input: './src/browser.ts',
		output: [
			{
				file: 'dist/langauge.js',
				format: 'iife',
				sourcemap: true,
			},
		],
		plugins: [resolve(), ts],
	},
	{
		input: './src/browser.ts',
		output: [
			{
				file: 'dist/langauge.min.js',
				format: 'iife',
			},
		],
		plugins: [resolve(), ts, terser()],
	},
]

export default config
