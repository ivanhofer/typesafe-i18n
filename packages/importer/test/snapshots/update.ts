/* eslint-disable no-console */

import { readFileSync, writeFileSync } from 'fs'
import { dirname, resolve } from 'path'
import glob from 'tiny-glob/sync.js'
import { fileURLToPath } from 'url'
import { createPathIfNotExits } from '../../../generator/src/file-utils'

//@ts-ignore
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

console.log(`
updating generated files ...`)

const files = glob('../generated/**/*.*', { cwd: __dirname })
for (const file of files) {
	const actual = readFileSync(resolve(`${__dirname}/${file}`), 'utf-8')
	const newFileName = resolve(`${__dirname}/${file.replace('generated', 'snapshots')}`)
	await createPathIfNotExits(newFileName.substring(0, newFileName.lastIndexOf('/')))
	writeFileSync(newFileName, actual)
}

console.log('... completed')
