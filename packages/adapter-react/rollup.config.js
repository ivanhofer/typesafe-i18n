// @ts-check

import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import externals from 'rollup-plugin-node-externals'
import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import path from 'path'

const getPath = (file) => path.resolve(__dirname, file)

const createConfig = (minify) => ({
	input: getPath('src/react-context.ts'),
	output: [
		{
			file: getPath(`../../react/react-context${minify ? '.min' : ''}.js`),
			format: 'esm',
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

export default [createConfig(false), createConfig(true)]
