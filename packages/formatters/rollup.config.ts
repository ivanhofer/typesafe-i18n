import fs from 'fs'
import path from 'path'

import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import { terser } from 'rollup-plugin-terser'

const getPath = (file) => path.resolve(__dirname, file)

const files = fs.readdirSync(getPath('./src'))

const config = files
	.filter((file) => !file.includes('_types.ts'))
	.map((file) => ({
		input: getPath(`./src/${file}`),
		output: [
			{
				file: getPath(`../../formatters/${file.replace('.ts', '.js')}`),
				format: 'esm',
			},
		],
		plugins: [
			resolve(),
			commonjs(),
			typescript({
				tsconfig: getPath('./tsconfig.json'),
				declaration: true,
				sourceMap: false,
			}),
			terser(),
		],
	}))

export default config
