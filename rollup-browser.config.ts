import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import { terser } from 'rollup-plugin-terser'

const wrap = (type) => (type ? `.${type}` : '')

const getConfig = (type, minify = false) => ({
	input: `./src/browser${wrap(type)}.ts`,
	output: [
		{
			file: `dist/langauge${wrap(type)}${minify ? '.min' : ''}.js`,
			format: 'iife',
			sourcemap: true,
		},
	],
	plugins: [resolve(), typescript(), minify && terser()],
})

const getConfigs = (type) => [getConfig(type), getConfig(type, true)]

export default [
	...getConfigs(''),
	...getConfigs('string'),
	...getConfigs('object'),
	...getConfigs('loader'),
	...getConfigs('loader.async'),
]
