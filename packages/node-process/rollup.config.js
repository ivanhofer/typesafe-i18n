// @ts-check

import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import path from 'path'
import externals from 'rollup-plugin-node-externals'

const getPath = (file) => path.resolve(__dirname, file)

const config = [
	{
		input: getPath('src/node-generator.ts'),
		output: [
			{
				banner: '#!/usr/bin/env node\n',
				file: getPath('../../node/generator.mjs'),
				format: 'esm',
				sourcemap: true,
			},
		],
		external: ['typescript', 'chokidar'],
		plugins: [
			resolve({ preferBuiltins: true }),
			commonjs(),
			externals(),
			typescript()
		],
	},
]

export default config
