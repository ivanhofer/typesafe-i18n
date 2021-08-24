// @ts-check

import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import fs from 'fs'
import path from 'path'
import { terser } from 'rollup-plugin-terser'

const getPath = (file) => path.resolve(__dirname, file)

const files = fs.readdirSync(getPath('./src'))

const config = files
	.filter((file) => !file.startsWith('_'))
	.flatMap((file) =>
		['esm', 'cjs'].map((format) => ({
			input: getPath(`./src/${file}`),
			output: [
				{
					file: getPath(`../../formatters/${file.replace('.ts', `.${format === 'esm' ? 'm' : 'c'}js`)}`),
					format,
					exports: 'auto',
				},
			],
			plugins: [
				resolve(),
				commonjs(),
				typescript({
					tsconfig: getPath('./tsconfig.json'),
					sourceMap: false,
					declaration: false,
					declarationDir: null,
				}),
				terser(),
			],
		})),
	)

export default config
