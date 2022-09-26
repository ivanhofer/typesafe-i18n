import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import { i18nObject, i18nString } from '../../runtime/src/index.mjs'
import { date, identity, ignore, lowercase, number, replace, uppercase } from './index.mjs'

const test = suite('formatters')

const translation = {
	UPPERCASE: 'This is a {0|uppercase}.',
	MANUAL_UPPERCASE: 'I AM {0|manualUppercase}.',
	LOWERCASE: 'This should be {0|lowercase}.',
	CENSOR_NUMBERS: 'Your PIN is {0|censorNumbers}',
	DATE_EN: 'The date is {0|dateEN}.',
	DATE_CUSTOM: 'The date is {0|dateCUSTOM}.',
	NUMBER: 'Price: {total:number|currency}',
	NO_SPACES: '{0|noSpaces}',
	IGNORE: 'Hi {name|ignore}',
	IDENTITY: 'Hi {name|identity}',
	CHAINING: '{count|sqrt|round}',
}

const formatters = {
	uppercase,
	manualUppercase: (value: string) => value.toUpperCase(),
	lowercase,
	censorNumbers: replace(/[0-9]/g, '*'),
	dateEN: date('en'),
	dateCUSTOM: date('en', { day: 'numeric', month: 'long', year: '2-digit' }),
	noSpaces: (value: string) => value.replace(/\s/g, ''),
	ignore,
	identity,
	sqrt: Math.sqrt,
	round: Math.round,
	currency: number('en', { style: 'currency', currency: 'USD' }),
}

const LLL = i18nString('en', formatters)

test('LLL uppercase', () => assert.is(LLL('This is a {0|uppercase}', 'test'), 'This is a TEST'))

const LL = i18nObject('en', translation, formatters)

const someDate = new Date(1584057600000)

test('uppercase', () => assert.is(LL.UPPERCASE('test'), 'This is a TEST.'))

test('manual uppercase', () => assert.is(LL.MANUAL_UPPERCASE('big'), 'I AM BIG.'))

test('lowercase', () => assert.is(LL.LOWERCASE('SMALL'), 'This should be small.'))

test('censor numbers', () => assert.is(LL.CENSOR_NUMBERS('1234'), 'Your PIN is ****'))

test('date en', () => assert.is(LL.DATE_EN(someDate), 'The date is 3/13/2020.'))

test('date custom', () => assert.is(LL.DATE_CUSTOM(someDate), 'The date is March 13, 20.'))

test('number', () => assert.is(LL.NUMBER({ total: 1000 }), 'Price: $1,000.00'))

test('no spaces', () => assert.is(LL.NO_SPACES('some text with no spaces'), 'sometextwithnospaces'))

test('ignore', () => assert.is(LL.IGNORE({ name: 'John' }), 'Hi '))

test('identity', () => assert.is(LL.IDENTITY({ name: 'John' }), 'Hi John'))

test('chaining', () => assert.is(LL.CHAINING({ count: 5 }), '2'))

test.run()
