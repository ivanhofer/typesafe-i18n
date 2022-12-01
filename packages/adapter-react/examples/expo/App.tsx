import * as Localization from 'expo-localization'
import React, { useEffect, useState } from 'react'
import Child from './src/Child'
import TypesafeI18n from './src/i18n/i18n-react'
import { Locales } from './src/i18n/i18n-types'
import { isLocale } from './src/i18n/i18n-util'
import { loadLocaleAsync } from './src/i18n/i18n-util.async'
import { getUserLocale } from './src/locale-storage'
import './src/polyfill/Intl'

// Get default locale from device settings.
const DEFAULT_LOCALE = Localization.getLocales().map(it => it.languageTag).find(isLocale) ?? 'en';

export default function App() {
	const [localeLoaded, setLocaleLoaded] = useState<Locales | null>(null)

	useEffect(() => {
		getUserLocale(DEFAULT_LOCALE)
			.then(async locale => { await loadLocaleAsync(locale); return locale })
			.then(setLocaleLoaded)
	}, [])

	if (localeLoaded === null) return null

	return (
		<TypesafeI18n locale={localeLoaded}>
			<Child />
		</TypesafeI18n>
	)
}
