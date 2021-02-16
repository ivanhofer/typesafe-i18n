import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import externals from 'rollup-plugin-node-externals'
import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'

const createConfig = (minify) => ({
	input: './src/svelte-store.ts',
	output: [
		{
			file: `svelte/svelte-store${minify ? '.min' : ''}.js`,
			format: 'esm',
			sourcemap: !minify,
			exports: 'named',
		},
	],
	external: ['svelte/store'],
	plugins: [
		commonjs(),
		resolve({ preferBuiltins: true }),
		externals(),
		typescript({ sourceMap: !minify }),
		minify && terser(),
	],
})

export default [createConfig(false), createConfig(true)]
