// this file will replace all the expected.js files with their _actual equivalents

import { readFileSync, writeFileSync } from 'fs'
import { dirname } from 'path'
import glob from 'tiny-glob/sync.js'
import { fileURLToPath } from 'url'

//@ts-ignore
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

console.log(`
updating generated files ...`
)

glob('**/*.actual.*', { cwd: __dirname }).forEach((file) => {
	const actual = readFileSync(`${__dirname}/${file}`, 'utf-8')
	writeFileSync(`${__dirname}/${file.replace('.actual.', '.expected.')}`, actual)
})

console.log('... completed')
