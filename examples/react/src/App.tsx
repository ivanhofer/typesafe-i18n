import React from 'react'
import './App.css'
import Child from './Child'
import TypesafeI18n from './i18n/i18n-react'
import { localStorageDetector } from 'typesafe-i18n/detectors'
import { detectLocale } from './i18n/i18n-util'

function App() {
	const detectedLocale = detectLocale(localStorageDetector)

	return (
		<TypesafeI18n initialLocale={detectedLocale}>
			<div className="App">
				<Child></Child>
			</div>
		</TypesafeI18n>
	)
}

export default App
