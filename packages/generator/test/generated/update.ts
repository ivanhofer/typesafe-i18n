// this file will replace all the expected.js files with their _actual equivalents

import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import glob from 'tiny-glob/sync.js'

console.log(`
updating generated files ...`
)

const cwd = typeof __dirname !== 'undefined'
  ? __dirname
  : dirname(fileURLToPath(import.meta.url))

glob('**/*.actual.*', { cwd }).forEach((file) => {
	const actual = readFileSync(`${cwd}/${file}`, 'utf-8')
	writeFileSync(`${cwd}/${file.replace('.actual.', '.expected.')}`, actual)
})

console.log('... completed')
