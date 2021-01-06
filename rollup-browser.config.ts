import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import { terser } from 'rollup-plugin-terser'

const coreConfig = (minify = false) => ({
	input: './src/browser.ts',
	output: [
		{
			file: `dist/langauge${minify ? '.min' : ''}.js`,
			format: 'iife',
			sourcemap: true,
		},
	],
	plugins: [resolve(), typescript(), minify && terser()],
})

const utilConfig = (minify = false) => ({
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

const config = [coreConfig(), coreConfig(true), utilConfig(), utilConfig(true)]

export default config
