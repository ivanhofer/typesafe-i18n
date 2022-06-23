import type { AppProps } from 'next/app'
import React, { useEffect, useState } from 'react'
import TypesafeI18n from '../src/i18n/i18n-react'
import { Locales } from '../src/i18n/i18n-types'
import { baseLocale, detectLocale } from '../src/i18n/i18n-util'
import { loadLocaleAsync } from '../src/i18n/i18n-util.async'
import '../src/styles/App.css'
import '../src/styles/index.css'

function MyApp({ Component, pageProps, router }: AppProps) {
  const [locale, setLocale] = useState<Locales | undefined>(undefined)

	useEffect(() => {
    const l = detectLocale(() => [router.locale || baseLocale])

		loadLocaleAsync(l).then(() => setLocale(l))
	}, [])

	if (!locale) return null
  
  return (
  <TypesafeI18n locale={locale}>
    <div className="App">
    < Component {...pageProps} />
    </div>
  </TypesafeI18n>
  )
}

export default MyApp
