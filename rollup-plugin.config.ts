import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import externals from 'rollup-plugin-node-externals'
import commonjs from '@rollup/plugin-commonjs'

const config = [
	{
		input: './src/rollup-plugin-langauge.ts',
		output: [
			{
				file: 'rollup/rollup-plugin-langauge.js',
				format: 'cjs',
				sourcemap: true,
				exports: 'named',
			},
		],
		plugins: [
			commonjs(),
			externals(),
			resolve(),
			typescript({
				declaration: true,
				emitDeclarationOnly: true,
			}),
		],
	},
]

export default config
