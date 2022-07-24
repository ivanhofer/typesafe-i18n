import type { Locale } from '@typesafe-i18n/runtime/core.mjs'
import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import { initRequestHostnameDetector } from '../../src/detectors/server/request-hostname.mjs'

const test = suite('detector:request-hostname')

// --------------------------------------------------------------------------------------------------------------------

type Request = {
	hostname: string
}

const testDetector = (name: string, hostname: string, expected: Locale[]) =>
	test(`request-hostname ${name}`, () => {
		const req = { hostname } as Request
		const detector = initRequestHostnameDetector(req)
		assert.equal(detector(), expected)
	})

testDetector('undefined', '', [])

testDetector('unspecified', 'domain.tld', [])

testDetector('with subdomain', 'subdomain.domain.tld', [])

testDetector('with language', 'en.domain.tld', ['en'])

testDetector('with language and subdomain', 'en.subdomain.domain.tld', ['en'])

testDetector('with language and region', 'en-GB.domain.tld', ['en-GB'])

testDetector('with language, region, and subdomain', 'en-GB.subdomain.domain.tld', ['en-GB'])

// From Appendix A. Examples of Language Tags (Informative), RFC 5646

testDetector('German', 'de.domain.tld', ['de'])

testDetector('French', 'fr.domain.tld', ['fr'])

testDetector('Japanese', 'ja.domain.tld', ['ja'])

testDetector('Chinese written using the Traditional Chinese script', 'zh-Hant.domain.tld', ['zh-Hant'])

testDetector('Chinese written using the Simplified Chinese script', 'zh-Hans.domain.tld', ['zh-Hans'])

testDetector('Serbian written using the Cyrillic script', 'sr-Cryl.domain.tld', ['sr-Cryl'])

testDetector('Serbian written using the Latin script', 'sr-Latn.domain.tld', ['sr-Latn'])

testDetector('Chinese, Mandarin, Simplified script, as used in China', 'zh-cmn-Hans-CN.domain.tld', ['zh-cmn-Hans-CN'])

testDetector('Mandarin Chinese, Simplified script, as used in China', 'cmn-Hans-CN.domain.tld', ['cmn-Hans-CN'])

testDetector('Chinese, Cantonese, as used in Hong Kong SAR', 'zh-yue-HK.domain.tld', ['zh-yue-HK'])

testDetector('Cantonese Chinese, as used in Hong Kong SAR', 'yue-HK.domain.tld', ['yue-HK'])

testDetector('Chinese written using the Simplified script as used in mainland China', 'zh-Hans-CN.domain.tld', [
	'zh-Hans-CN',
])

testDetector('Serbian written using the Latin script as used in Serbia', 'sr-Latn-RS.domain.tld', ['sr-Latn-RS'])

testDetector('Resian dialect of Slovenian', 'sl-rozaj.domain.tld', ['sl-rozaj'])

testDetector('San Giorgio dialect of Resian dialect of Slovenian', 'sl-rozaj-biske.domain.tld', ['sl-rozaj-biske'])

testDetector('Nadiza dialect of Slovenian', 'sl-nedis.domain.tld', ['sl-nedis'])

testDetector('German as used in Switzerland using the 1901 variant [orthography]', 'de-CH-1901.domain.tld', [
	'de-CH-1901',
])

testDetector('Slovenian as used in Italy, Nadiza dialect', 'sl-IT-nedis.domain.tld', ['sl-IT-nedis'])

testDetector('Eastern Armenian written in Latin script, as used in Italy', 'hy-Latn-IT-arevela.domain.tld', [
	'hy-Latn-IT-arevela',
])

testDetector('German for Germany', 'de-DE.domain.tld', ['de-DE'])

testDetector('English as used in the United States', 'en-US.domain.tld', ['en-US'])

testDetector(
	'Spanish appropriate for the Latin America and Caribbean region using the UN region code',
	'es-419.domain.tld',
	['es-419'],
)

// --------------------------------------------------------------------------------------------------------------------

test.run()
