import React from 'react'
import './App.css'
import Child from './Child'
import I18nContext, { useI18n } from './i18n/i18n-react'
import { Locales } from './i18n/i18n-types'

function App() {
	const i18n = useI18n((localStorage.getItem('locale') as Locales) || undefined)
	const { loaded, LL } = i18n
	if (loaded) console.log(LL.STARTUP())

	return (
		<I18nContext.Provider value={i18n}>
			<div className="App">
				<Child></Child>
			</div>
		</I18nContext.Provider>
	)
}

export default App
