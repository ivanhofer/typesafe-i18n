import { readTranslationFromDisk, readTranslationsFromDisk } from 'typesafe-i18n/exporter'
import { test } from 'uvu'
import * as assert from 'uvu/assert'
import type { Locales } from '../src/i18n/i18n-types'
import { loadedLocales, locales } from '../src/i18n/i18n-util'
import { loadLocale } from '../src/i18n/i18n-util.sync'

test('readTranslationFromDisk should return an ExportLocaleMapping', async () => {
	const locale = 'en'

	const result = await readTranslationFromDisk(locale)

	loadLocale(locale)

	assert.equal(result.locale, locale)
	assert.equal(result.translations, loadedLocales['en'])
	assert.equal(result.namespaces, ['my-namespace'])
})

test('readTranslationsFromDisk should return all ExportLocaleMappings', async () => {
	const result = await readTranslationsFromDisk()

	assert.equal(result.length, locales.length)
	locales.forEach((l) => assert.ok(result.find(({ locale }) => l === locale)))
})

test('readTranslationFromDisk with non-present locale should fail', async () => {
	try {
		await readTranslationFromDisk('fr' as Locales)
		assert.unreachable('should have thrown')
	} catch (err) {
		assert.ok(err)
	}
})

test.run()
