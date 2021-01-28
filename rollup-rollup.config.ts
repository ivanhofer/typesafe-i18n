import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import externals from 'rollup-plugin-node-externals'
import commonjs from '@rollup/plugin-commonjs'
import stripCode from 'rollup-plugin-strip-code'

const config = [
	{
		input: './src/rollup-plugin-langauge-watcher.ts',
		output: [
			{
				file: 'rollup/rollup-plugin-langauge-watcher.js',
				format: 'cjs',
				sourcemap: true,
				exports: 'named',
			},
		],
		plugins: [
			stripCode({
				start_comment: 'optimize-start',
				end_comment: 'optimize-end',
			}),
			commonjs(),
			resolve({ preferBuiltins: true }),
			externals(),
			typescript(),
		],
	},
]

export default config
