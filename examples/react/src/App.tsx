import React from 'react'
import './App.css'
import Child from './Child'
import TypesafeI18n from './i18n/i18n-react'
import { detectLocale, localStorageDetector } from 'typesafe-i18n/detectors'
import { baseLocale, locales } from './i18n/i18n-util'

function App() {
	const detectedLocale = detectLocale(baseLocale, locales, localStorageDetector)

	return (
		<TypesafeI18n initialLocale={detectedLocale}>
			<div className="App">
				<Child></Child>
			</div>
		</TypesafeI18n>
	)
}

export default App
