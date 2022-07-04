import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import type { Locale } from '../../../runtime/src/core'
import { initRequestHostnameDetector } from '../../src/detectors/server/request-hostname'

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

testDetector('French', 'fr.domain.tld', ['fr'])

testDetector('French with subdomain', 'fr.subdomain.domain.tld', ['fr'])

testDetector('French (Canada)', 'fr-CA.domain.tld', ['fr-CA'])

testDetector('French (Canada) with subdomain', 'fr-CA.subdomain.domain.tld', ['fr-CA'])

// --------------------------------------------------------------------------------------------------------------------

test.run()
