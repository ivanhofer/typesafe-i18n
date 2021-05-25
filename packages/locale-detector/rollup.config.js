// @ts-check

import path from 'path'

import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import { terser } from 'rollup-plugin-terser'
import { sync as glob } from 'glob'

const getPath = (file) => path.resolve(__dirname, file)

const files = glob(path.resolve(__dirname, `./src/**/*.ts`)).map((file) =>
	path
		.resolve(file)
		.substring(path.resolve(__dirname, `./src/`).length + 1)
		.replace(/\\/g, '/'),
)

const getOutputFormat = (file) => (file.startsWith('detectors/browser') ? 'esm' : 'cjs')

const config = files
	.filter((file) => !file.split('/').some((part) => part.startsWith('_')))
	.map((file) => ({
		input: getPath(`./src/${file}`),
		output: [
			{
				file: getPath(`../../detectors/${file.replace('.ts', '.js')}`),
				format: getOutputFormat(file),
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
