// @ts-check

import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import path from 'path'
import externals from 'rollup-plugin-node-externals'

const getPath = (file) => path.resolve(__dirname, file)

const config = [
	{
		input: getPath('src/cli.ts'),
		output: [
			{
				banner: '#!/usr/bin/env node\n',
				file: getPath('../../cli/typesafe-i18n.mjs'),
				format: 'esm',
				sourcemap: false,
			},
		],
		external: ['typescript', 'chokidar'],
		plugins: [
			resolve({ preferBuiltins: true }),
			commonjs(),
			externals(),
			json(),
			typescript({
				tsconfig: getPath('./tsconfig.json'),
				sourceMap: false,
				declaration: false,
				declarationDir: null,
			}),
		],
	},
]

export default config
