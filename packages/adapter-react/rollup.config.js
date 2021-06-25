// @ts-check

import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import path from 'path'
import externals from 'rollup-plugin-node-externals'
import { terser } from 'rollup-plugin-terser'

const getPath = (file) => path.resolve(__dirname, file)

const createConfig = (format, minify) => ({
	input: getPath('src/react-context.ts'),
	output: [
		{
			file: getPath(`../../react/react-context.${format}${minify ? '.min' : ''}.js`),
			format,
			sourcemap: !minify,
			exports: 'named',
		},
	],
	external: ['react'],
	plugins: [
		commonjs(),
		resolve({ preferBuiltins: true }),
		externals(),
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
