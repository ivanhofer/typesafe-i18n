import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import { terser } from 'rollup-plugin-terser'

const wrap = (type) => (type ? `.${type}` : '')

const iifeConfig = (type, minify = false) => ({
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

const getIifeConfigs = (type) => [iifeConfig(type), iifeConfig(type, true)]

const esmConfig = (minify = false) => ({
	input: './src/index.ts',
	output: [
		{
			file: `dist/index${minify ? '.min' : ''}.js`,
			format: 'esm',
			sourcemap: true,
		},
	],
	plugins: [resolve(), typescript(), minify && terser()],
})

export default [
	...getIifeConfigs(''),
	...getIifeConfigs('string'),
	...getIifeConfigs('object'),
	...getIifeConfigs('loader'),
	...getIifeConfigs('loader.async'),
	esmConfig(),
	esmConfig(true),
]
