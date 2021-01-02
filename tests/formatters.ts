import { suite } from 'uvu'
import * as assert from 'uvu/assert'

import { langauge } from '../src/index'
import { uppercase, lowercase, replace, date } from '../src/formatters'

const test = suite('formatters')

const translation = {
	UPPERCASE: 'This is a {0|uppercase}.',
	MANUAL_UPPERCASE: 'I AM {0|manualUppercase}.',
	LOWERCASE: 'This should be {0|lowercase}.',
	CENSOR_NUMBERS: 'Your PIN is {0|censorNumbers}',
	DATE_EN: 'The date is {0|dateEN}.',
	DATE_CUSTOM: 'The date is {0|dateCUSTOM}.',
	NO_SPACES: '{0|noSpaces}',
}

const formatters = {
	uppercase,
	manualUppercase: (value: string) => value.toUpperCase(),
	lowercase,
	censorNumbers: replace(/[0-9]/g, '*'),
	dateEN: date('en'),
	dateCUSTOM: date('en', { day: 'numeric', month: 'long', year: '2-digit' }),
	noSpaces: (value: string) => value.replace(/\s/g, ''),
}

const LLL = langauge(translation, { formatters })

const someDate = new Date('2020-03-13')

test('uppercase', () => assert.is(LLL.UPPERCASE('test'), 'This is a TEST.'))

test('manual uppercase', () => assert.is(LLL.MANUAL_UPPERCASE('big'), 'I AM BIG.'))

test('lowercase', () => assert.is(LLL.LOWERCASE('SMALL'), 'This should be small.'))

test('censor numbers', () => assert.is(LLL.CENSOR_NUMBERS('1234'), 'Your PIN is ****'))

test('date en', () => assert.is(LLL.DATE_EN(someDate), 'The date is 3/13/2020.'))

test('date custom', () => assert.is(LLL.DATE_CUSTOM(someDate), 'The date is March 13, 20.'))

test('no spaces', () => assert.is(LLL.NO_SPACES('some text with no spaces'), 'sometextwithnospaces'))

test.run()
