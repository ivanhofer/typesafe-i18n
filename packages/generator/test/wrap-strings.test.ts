import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import { getWrappedString } from '../src/utils/dictionary.utils'

const test = suite('wrap-strings')

const cases: [string, string][] = [
	[``, `''`],
	[`'`, `"'"`],
	[`"`, `'"'`],
	[`'"`, `\`'"\``],
	[`test`, `'test'`],
	[
		'This is a\nexample.',
		`\`This is a
example.\``,
	],
]

cases.forEach(([text, expected]) =>
	test(`getWrappedString: ${text}}`, () => assert.is(getWrappedString(text), expected)),
)

test.run()
