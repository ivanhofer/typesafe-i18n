/* eslint-disable no-console */

import { readFileSync, writeFileSync } from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

//@ts-ignore
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

console.log(`
creating tree-shakable index files ...`)

const content = readFileSync(resolve(__dirname, './src/index.mts'))
	.toString()
	.split(/\r?\n/)
	.filter((line) => !line.startsWith('export type'))
	.join('\r\n')

writeFileSync(resolve(__dirname, '../../detectors/index.mjs'), content, { encoding: 'utf8' })

console.log('... completed')
