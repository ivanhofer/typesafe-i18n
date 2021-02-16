import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import externals from 'rollup-plugin-node-externals'
import commonjs from '@rollup/plugin-commonjs'

const config = [
	{
		input: './src/rollup-plugin-typesafe-i18n-watcher.ts',
		output: [
			{
				file: 'rollup/rollup-plugin-typesafe-i18n-watcher.js',
				format: 'cjs',
				sourcemap: true,
				exports: 'named',
			},
		],
		external: ['typescript'],
		plugins: [commonjs(), resolve({ preferBuiltins: true }), externals(), typescript()],
	},
]

export default config
