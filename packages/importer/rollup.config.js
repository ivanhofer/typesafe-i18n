// @ts-check

import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import path from 'path'
import externals from 'rollup-plugin-node-externals'

const getPath = (file) => path.resolve(__dirname, file)

const config = ['esm', 'cjs'].map((format) => (
	{
		input: getPath('src/index.ts'),
		output: [
			{
				file: getPath(`../../importer/index.${format === 'esm' ? 'm' : 'c'}js`),
				format,
				sourcemap: true,
			},
		],
		external: ['typescript'],
		plugins: [
			resolve({ preferBuiltins: true }),
			commonjs({ ignoreDynamicRequires: true }),
			externals(),
			typescript(),
		],
	}))

export default config
