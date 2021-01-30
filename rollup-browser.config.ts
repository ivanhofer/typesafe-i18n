import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import replace from '@rollup/plugin-replace'
import { terser } from 'rollup-plugin-terser'

const wrap = (type) => (type ? `.${type}` : '')

const getPlugins = (minify) => [
	replace({ 'process.env.npm_lifecycle_event': "'build'" }),
	resolve(),
	typescript({ sourceMap: !minify }),
	minify && terser(),
]

const iifeConfig = (type, minify = false) => ({
	input: `./src/browser${wrap(type)}.ts`,
	output: [
		{
			file: `dist/langauge${wrap(type)}${minify ? '.min' : ''}.js`,
			format: 'iife',
			sourcemap: !minify,
		},
	],
	plugins: getPlugins(minify),
})

const getIifeConfigs = (type) => [iifeConfig(type), iifeConfig(type, true)]

const esmConfig = (minify = false) => ({
	input: './src/index.ts',
	output: [
		{
			file: `dist/index${minify ? '.min' : ''}.js`,
			format: 'esm',
			sourcemap: !minify,
		},
	],
	plugins: getPlugins(minify),
})

export default [
	...getIifeConfigs(''),
	...getIifeConfigs('string'),
	...getIifeConfigs('object'),
	...getIifeConfigs('instance'),
	// ...getIifeConfigs('loader'),
	// ...getIifeConfigs('loader.async'),
	esmConfig(),
	esmConfig(true),
]
