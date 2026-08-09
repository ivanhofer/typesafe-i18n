import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import { parseTypescriptVersion, type TypescriptVersion } from './generator.utils.mjs'
import { getTypescriptVersion } from './typescript.utils.mjs'

const test = suite('typescript-version')

const cases: [string, TypescriptVersion][] = [
	['3.5', { major: 3, minor: 5 }],
	['5.1', { major: 5, minor: 1 }],
	['7.0', { major: 7, minor: 0 }],
	['', { major: 0, minor: 0 }],
]

cases.forEach(([version, expected]) =>
	test(`parseTypescriptVersion: '${version}'`, () => assert.equal(parseTypescriptVersion(version), expected)),
)

test('getTypescriptVersion detects the installed version', async () => {
	const version = await getTypescriptVersion()
	assert.ok(version.major >= 3)
})

test.run()
