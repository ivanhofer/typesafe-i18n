// @ts-check

import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import path from 'path'
import { terser } from 'rollup-plugin-terser'

const getPath = (file) => path.resolve(__dirname, file)

const wrap = (type) => (type ? `.${type}` : '')

const getPlugins = (minify) => [
	resolve(),
	typescript({
		tsconfig: getPath('./tsconfig.json'),
		sourceMap: !minify,
		declaration: false,
		declarationDir: null,
	}),
	minify && terser()
]

const iifeConfig = (type, minify = false) => ({
	input: getPath(`src/browser${wrap(type)}.ts`),
	output: [
		{
			file: getPath(`../../dist/i18n${wrap(type)}${minify ? '.min' : ''}.js`),
			format: 'iife',
			sourcemap: !minify,
		},
	],
	plugins: getPlugins(minify),
})

const getIifeConfigs = (type) => [iifeConfig(type), iifeConfig(type, true)]

export default [
	...getIifeConfigs('instance'),
	...getIifeConfigs('string'),
	...getIifeConfigs('object'),
	...getIifeConfigs('all'),
]
