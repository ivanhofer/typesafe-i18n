import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

const content = readFileSync(resolve(__dirname, './src/index.ts'))
	.toString()
	.split(/\r?\n/)
	.filter((line) => !line.startsWith('export type'))
	.join('\r\n')

writeFileSync(resolve(__dirname, '../../detectors/index.mjs'), content, { encoding: 'utf8' })
