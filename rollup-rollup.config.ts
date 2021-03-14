import fs from 'fs'

import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import externals from 'rollup-plugin-node-externals'
import commonjs from '@rollup/plugin-commonjs'

const files = fs.readdirSync('src/')

const config = files
	.filter((file) => file.startsWith('rollup-plugin-typesafe-i18n'))
	.map((file) => ({
		input: `src/${file}`,
		output: [
			{
				file: `rollup/${file.replace('.ts', '.js')}`,
				format: 'cjs',
				sourcemap: true,
				exports: 'named',
			},
		],
		external: ['typescript'],
		plugins: [commonjs(), resolve({ preferBuiltins: true }), externals(), typescript()],
	}))

export default config
