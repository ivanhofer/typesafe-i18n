import { readFile } from 'fs/promises'
import { resolve } from 'path'
import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import type { BaseTranslation } from '../../runtime/src'
import { storeTranslationToDisk } from '../src/importer'

const test = suite('importer')

const REGEX_INDENT = /(\t|\s+)/g
const unifyIndent = (text: string) => text.replace(REGEX_INDENT, ' ')

const testImporter = (name: string, translations: BaseTranslation | BaseTranslation[]) =>
	test(`importer ${name}`, async () => {
		const result = await storeTranslationToDisk({ locale: name, translations }, false)

		assert.is(result, name)

		const actual: string = unifyIndent(
			(await readFile(resolve(`snapshots/${name}/index.ts`)).catch(() => '')).toString(),
		)

		const expected: string = unifyIndent((await readFile(resolve(`generated/${name}/index.ts`))).toString())

		assert.is(actual, expected)
	})

testImporter('basic', { test: 'this is a test for {0}' })

testImporter('nested', {
	i: {
		am: { deeply: { nested: 'i am deeply nested' } },
		nested: 'i am nested',
	},
})

testImporter('array', ['a', 'b', 'c'])

testImporter('array-nested', [['a', 'b', 'c'], 'b', ['c', ['e', 'f']]])

testImporter('mixed', [{ a: 'b', c: { d: { e: 'test' } } }, ['c', ['e', 'f']]])

test.run()
