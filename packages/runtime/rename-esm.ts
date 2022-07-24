import { readFileSync, writeFileSync } from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const throwError = () => {
	throw Error('failed to remove CJS Proxy')
}

const fullFilePath = resolve(__dirname, '../../runtime/esm/runtime/src/util.object.mjs')

const content = readFileSync(fullFilePath).toString()
if (!content) throwError()

const BEGIN_MARKER = '/* PROXY-CJS-START */'
const END_MARKER = '/* PROXY-CJS-END */'
const start = content.indexOf(BEGIN_MARKER)
const end = content.indexOf(END_MARKER) + END_MARKER.length
if (start < 0 || end < 0) throwError()

const newContent = content.substring(0, start) + content.substring(end)

writeFileSync(fullFilePath, newContent, { encoding: 'utf8' })

// eslint-disable-next-line no-console, no-undef
console.log('CJS Proxy removed')
