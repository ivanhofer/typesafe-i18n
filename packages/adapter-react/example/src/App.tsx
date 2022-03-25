import React, { useEffect, useState } from 'react'
import { localStorageDetector } from 'typesafe-i18n/detectors'
import './App.css'
import Child from './Child'
import TypesafeI18n from './i18n/i18n-react'
import { detectLocale } from './i18n/i18n-util'
import { loadLocaleAsync } from './i18n/i18n-util.async'

const detectedLocale = detectLocale(localStorageDetector)

function App() {
	const [wasLoaded, setWasLoaded] = useState(false)

	useEffect(() => {
		loadLocaleAsync(detectedLocale).then(() => setWasLoaded(true))
	}, [])

	if (!wasLoaded) return null

	return (
		<TypesafeI18n locale={detectedLocale}>
			<div className="App">
				<Child />
			</div>
		</TypesafeI18n>
	)
}

export default App
