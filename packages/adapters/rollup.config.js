// @ts-check

import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import path from 'path'
import { terser } from 'rollup-plugin-terser'

const getPath = (file) => path.resolve(__dirname, file)

const files = ['svelte', 'react']

const config = files.map((file) => ({
	input: getPath(`src/adapter-${file}.ts`),
	output: [
		{
			file: getPath(`../../adapters/adapter-${file}.js`),
			format: 'esm',
			sourcemap: true,
		},
	],
	external: [file],
	plugins: [
		resolve(),
		typescript({
			tsconfig: getPath('./tsconfig.json'),
			sourceMap: true,
			declaration: false,
			declarationDir: null,
		}),
		terser(),
	],
}))

export default config
