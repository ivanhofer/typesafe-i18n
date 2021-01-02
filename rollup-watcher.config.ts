import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import externals from 'rollup-plugin-node-externals'
import commonjs from '@rollup/plugin-commonjs'

const config = [
	{
		input: './src/node-watcher.ts',
		output: [
			{
				file: 'node/watcher.js',
				format: 'cjs',
				sourcemap: true,
			},
		],
		plugins: [commonjs(), externals(), resolve(), typescript()],
	},
]

export default config
