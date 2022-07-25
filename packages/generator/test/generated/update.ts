// this file will replace all the expected.js files with their _actual equivalents

import { readFileSync, writeFileSync } from 'fs'
import glob from 'tiny-glob/sync.js'

console.log(`
updating generated files ...`
)

const __dirname = new URL('.', import.meta.url).pathname;

glob('**/*.actual.*', { cwd: __dirname }).forEach((file) => {
	const actual = readFileSync(`${__dirname}/${file}`, 'utf-8')
	writeFileSync(`${__dirname}/${file.replace('.actual.', '.expected.')}`, actual)
})

console.log('... completed')
