import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import { terser } from 'rollup-plugin-terser'

const files = ['svelte', 'react']

const config = files.map((file) => ({
	input: [`src/adapter-${file}.ts`],
	output: [
		{
			file: `adapters/adapter-${file}.js`,
			format: 'esm',
		},
	],
	external: [file],
	plugins: [
		resolve(),
		typescript({
			tsconfig: './tsconfig-adapters.json',
			declaration: false,
			sourceMap: false,
		}),
		terser(),
	],
}))

export default config
