import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import externals from 'rollup-plugin-node-externals'
import commonjs from '@rollup/plugin-commonjs'

const config = [
	{
		input: './src/node-watcher.ts',
		output: [
			{
				banner: '#!/usr/bin/env node\n',
				file: 'node/watcher.js',
				format: 'cjs',
				sourcemap: true,
			},
		],
		external: ['typescript', 'chokidar'],
		plugins: [resolve({ preferBuiltins: true }), commonjs(), externals(), typescript()],
	},
]

export default config
