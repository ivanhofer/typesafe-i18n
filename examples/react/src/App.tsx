import React from 'react'
import './App.css'
import Child from './Child'
import TypesafeI18n from './i18n/i18n-react'
import { Locales } from './i18n/i18n-types'

function App() {
	const initialLocale = localStorage.getItem('locale') as Locales

	return (
		<TypesafeI18n initialLocale={initialLocale}>
			<div className="App">
				<Child></Child>
			</div>
		</TypesafeI18n>
	)
}

export default App
