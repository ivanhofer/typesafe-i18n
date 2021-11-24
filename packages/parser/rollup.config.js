// @ts-check

import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import path from 'path'
import externals from 'rollup-plugin-node-externals'
import { terser } from 'rollup-plugin-terser'

const getPath = (file) => path.resolve(__dirname, file)

const createConfig = (format, minify) => ({
	input: getPath('src/index.ts'),
	output: [
		{
			file: getPath(`../../parser/index${minify ? '.min' : ''}.${format === 'esm' ? 'm' : 'c'}js`),
			format,
			sourcemap: !minify,
		},
	],
	plugins: [
		resolve({ preferBuiltins: true }),
		commonjs({ ignoreDynamicRequires: true }),
		externals(),
		json(),
		typescript({
			tsconfig: getPath('./tsconfig.json'),
			sourceMap: !minify,
			declaration: false,
			declarationDir: null,
		}),
		minify && terser(),
	],
})

export default [
	createConfig('esm', false),
	createConfig('esm', true),
	createConfig('cjs', false),
	createConfig('cjs', true),
]
