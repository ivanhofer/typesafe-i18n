// @ts-check

import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import { sync as glob } from 'glob'
import path from 'path'
import { terser } from 'rollup-plugin-terser'

const getPath = (file) => path.resolve(__dirname, file)

const files = glob(path.resolve(__dirname, `./src/**/*.ts`))
	.map((file) =>
		path
			.resolve(file)
			.substring(path.resolve(__dirname, `./src/`).length + 1)
			.replace(/\\/g, '/'),
	)
	.filter((file) => !file.split('/').some((part) => part.startsWith('_') || part === 'index.ts'))

const getOutputFormat = (file) => (file.startsWith('detectors/browser') || file.endsWith('.esm.ts') ? 'esm' : 'cjs')

const config = files.map((file) => ({
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
