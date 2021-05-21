// @ts-check

import fs from 'fs'
import path from 'path'

import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import { terser } from 'rollup-plugin-terser'

const getPath = (file) => path.resolve(__dirname, file)

const isNotFolder = (fileName) => fileName.includes('.')

const files = [
	...fs.readdirSync(getPath('./src')).filter(isNotFolder),
	...fs.readdirSync(getPath('./src/detectors')).map((file) => `detectors/${file}`),
]

const config = files
	.filter((file) => !file.startsWith('_'))
	.map((file) => ({
		input: getPath(`./src/${file}`),
		output: [
			{
				file: getPath(`../../detectors/${file.replace('.ts', '.js')}`),
				format: 'cjs',
			},
		],
		plugins: [
			resolve(),
			commonjs(),
			typescript({
				tsconfig: getPath('./tsconfig.json'),
				sourceMap: false,
				declaration: false,
				declarationDir: null,
			}),
			terser(),
		],
	}))

export default config
