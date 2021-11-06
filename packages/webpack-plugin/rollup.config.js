// @ts-check

import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import path from 'path'
import externals from 'rollup-plugin-node-externals'

const getPath = (file) => path.resolve(__dirname, file)

const config = {
	input: getPath('src/webpack-plugin-typesafe-i18n.ts'),
	output: [
		{
			file: getPath('../../webpack/webpack-plugin-typesafe-i18n.js'),
			format: 'cjs',
			sourcemap: true,
			exports: 'named',
		},
	],
	external: ['typescript'],
	plugins: [
		commonjs(),
		resolve({ preferBuiltins: true }),
		externals(),
		typescript({
			tsconfig: getPath('./tsconfig.json'),
			declaration: false,
			declarationDir: null,
		}),
	],
}

export default config
