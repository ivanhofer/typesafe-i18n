// @ts-check

import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import externals from 'rollup-plugin-node-externals'
import commonjs from '@rollup/plugin-commonjs'
import path from 'path'

const getPath = (file) => path.resolve(__dirname, file)

const config = [
	{
		input: getPath('src/node-watcher.ts'),
		output: [
			{
				banner: '#!/usr/bin/env node\n',
				file: getPath('../../node/watcher.js'),
				format: 'cjs',
				sourcemap: true,
			},
		],
		external: ['typescript', 'chokidar'],
		plugins: [resolve({ preferBuiltins: true }), commonjs(), externals(), typescript()],
	},
]

export default config
