import { readFileSync, rename, writeFileSync } from 'fs'
import { sync as glob } from 'glob'
import { resolve } from 'path'

const files = glob(resolve(__dirname, `../../runtime/cjs/**/*.js`))

files.forEach((file) =>
	rename(file, file.replace('.js', '.cjs'), () => {
		undefined
	}),
)

// eslint-disable-next-line no-console
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

// eslint-disable-next-line no-console
console.log('ESM Proxy removed')
