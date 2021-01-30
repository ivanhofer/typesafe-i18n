import fs from 'fs'

import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import { terser } from 'rollup-plugin-terser'

const files = fs.readdirSync('src/formatters/')

const config = files
	.filter((file) => !file.includes('_types.ts'))
	.map((file) => ({
		input: [`src/formatters/${file}`],
		output: [
			{
				file: `formatters/${file.replace('.ts', '.js')}`,
				format: 'esm',
			},
		],
		plugins: [
			resolve(),
			typescript({
				tsconfig: './tsconfig-formatters.json',
				declaration: true,
				sourceMap: false,
			}),
			terser(),
		],
	}))

export default config
