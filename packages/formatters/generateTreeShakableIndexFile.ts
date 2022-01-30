/* eslint-disable no-console */

import { readFileSync, writeFileSync } from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

//@ts-ignore
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

console.log(`
creating tree-shakable index files ...`)

const content = readFileSync(resolve(__dirname, './src/index.ts')).toString()

writeFileSync(resolve(__dirname, '../../formatters/index.mjs'), content, { encoding: 'utf8' })

console.log('... completed')
