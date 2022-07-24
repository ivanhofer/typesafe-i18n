import type { Locale } from '@typesafe-i18n/runtime/core.mjs'
import { isNotUndefined } from 'typesafe-utils'
import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import { htmlLangAttributeDetector } from '../../src/detectors/browser/html-lang-attribute'

const test = suite('detector:html-lang')

// --------------------------------------------------------------------------------------------------------------------

const mockDocument = () =>
	({
		createElement: (_tag: 'html'): HTMLHtmlElement =>
			({
				setAttribute: function (_key: 'lang', value: string) {
					//@ts-ignore
					this._lang = value
				},
				get lang(): string {
					//@ts-ignore
					return this._lang
				},
			} as HTMLHtmlElement),
	} as Document)

const testDetector = (name: string, htmlLangValue: string | undefined, expected: Locale[]) =>
	test(`html-lang-attribute ${name}`, () => {
		globalThis.document = mockDocument()
		const html = globalThis.document.createElement('html')
		if (isNotUndefined(htmlLangValue)) {
			html.setAttribute('lang', htmlLangValue)
		}
		globalThis.document = { documentElement: html as HTMLElement } as Document

		assert.equal(htmlLangAttributeDetector(), expected)
	})

testDetector('undefined', undefined, [])

testDetector('empty', '', [])

testDetector('locale-without country', 'de', ['de'])

testDetector('locale-with country', 'en-GB', ['en-GB'])

// --------------------------------------------------------------------------------------------------------------------

test.run()
