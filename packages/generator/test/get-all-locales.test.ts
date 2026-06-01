import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import { getAllLocales, type FileSystemUtil } from '../../shared/src/file.utils.mjs'

const test = suite('getAllLocales')

type Dirent = { name: string; isDirectory: () => boolean }

const folder = (name: string): Dirent => ({ name, isDirectory: () => true })
const file = (name: string): Dirent => ({ name, isDirectory: () => false })

const ROOT = './i18n'

// the order in which the filesystem returns directory entries is not guaranteed
// to be stable across platforms or runs, so `getAllLocales` must sort the result
// to produce a deterministic output
const createFileSystem = (rootEntries: Dirent[]): FileSystemUtil => ({
	readFile: async () => '',
	readdir: async (path) => (String(path) === ROOT ? rootEntries : [file('index.ts')]),
})

test('returns the discovered locales sorted alphabetically', async () => {
	const fs = createFileSystem([folder('sk'), folder('cs'), folder('en')])

	assert.equal(await getAllLocales(fs, ROOT, 'TypeScript'), ['cs', 'en', 'sk'])
})

test('sorts locales independently of the filesystem order', async () => {
	const ascending = createFileSystem([folder('cs'), folder('en'), folder('sk')])
	const descending = createFileSystem([folder('sk'), folder('en'), folder('cs')])

	assert.equal(await getAllLocales(ascending, ROOT, 'TypeScript'), await getAllLocales(descending, ROOT, 'TypeScript'))
})

test('also sorts when looking for JavaScript locale files', async () => {
	const fs: FileSystemUtil = {
		readFile: async () => '',
		readdir: async (path) => (String(path) === ROOT ? [folder('sk'), folder('cs')] : [file('index.js')]),
	}

	assert.equal(await getAllLocales(fs, ROOT, 'JavaScript'), ['cs', 'sk'])
})

test.run()
