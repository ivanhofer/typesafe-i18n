import { readFileSync, renameSync, writeFileSync } from 'fs'
import globPkg from 'glob'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
const { sync: glob } = globPkg

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const files = glob(resolve(__dirname, `../../runtime/cjs/**/*.js`))

files.forEach((file) => renameSync(file, file.replace('.js', '.cjs')))

// eslint-disable-next-line no-console, no-undef
console.log(`renamed all '.js' file to '.cjs'`)

// --------------------------------------------------------------------------------------------------------------------

const throwError = () => {
	throw Error('failed to remove ESM Proxy')
}

const fullFilePath = resolve(__dirname, '../../runtime/cjs/runtime/src/util.object.cjs')

const content = readFileSync(fullFilePath).toString()
if (!content) throwError()

const BEGIN_MARKER = '/* PROXY-START */'
const END_MARKER = '/* PROXY-END */'
const start = content.indexOf(BEGIN_MARKER)
const end = content.indexOf(END_MARKER) + END_MARKER.length
if (start < 0 || end < 0) throwError()

let newContent = content.substring(0, start) + content.substring(end)
if (!newContent.includes('createCjsProxy')) throwError()

newContent = newContent.replace(/createCjsProxy/g, 'createProxy')

writeFileSync(fullFilePath, newContent, { encoding: 'utf8' })

// eslint-disable-next-line no-console, no-undef
console.log('ESM Proxy removed')
