// @ts-check

import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import { sync as glob } from 'glob'
import path from 'path'
import { terser } from 'rollup-plugin-terser'

const getPath = (file) => path.resolve(__dirname, file)

const files = glob(path.resolve(__dirname, `./src/**/*.*ts`))
	.map((file) =>
		path
			.resolve(file)
			.substring(path.resolve(__dirname, `./src/`).length + 1)
			.replace(/\\/g, '/'),
	)
	.filter((file) => !file.split('/').some((part) => part.startsWith('_')))

const config = files.flatMap((file) =>
	['esm', 'cjs'].map((format) => ({
		input: getPath(`./src/${file}`),
		output: [
			{
				file: getPath(`../../detectors/${file.replace('.ts', `.${format === 'esm' ? 'm' : ''}js`)}`),
				format,
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
