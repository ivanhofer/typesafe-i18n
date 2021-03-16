import React, { ChangeEventHandler, useContext, useState } from 'react'
import logo from './logo.svg'
import './App.css'
import I18nContext from './i18n/i18n-react'
import { locales } from './i18n/i18n-util'
import { Locales } from './i18n/i18n-types'

function App() {
	const [name, setName] = useState('John')

	const { setLocale, LL, locale } = useContext(I18nContext)

	const onLocaleSelected: ChangeEventHandler<HTMLSelectElement> = ({ target }) => {
		const locale = target.value as Locales
		localStorage.setItem('locale', locale)
		setLocale(locale)
	}

	const onNameChange: ChangeEventHandler<HTMLInputElement> = ({ target }) => setName(target.value)

	return (
		<header className="App-header">
			<label>
				{LL.SELECTED_LOCALE()}
				<select value={locale} onChange={onLocaleSelected}>
					<option value="" disabled>
						{LL.CHOOSE_LOCALE()}
					</option>
					{locales.map((locale) => (
						<option key={locale} value={locale}>
							{locale}
						</option>
					))}
				</select>
			</label>

			<hr />

			{LL.HI({ name })}
			<label>
				{LL.YOUR_NAME()}
				<input type="text" value={name} onChange={onNameChange} />
			</label>

			<hr />

			{LL.TODAY({ date: new Date() })}

			<hr />

			<img src={logo} className="App-logo" alt="logo" />

			<p dangerouslySetInnerHTML={{ __html: LL.EDIT_AND_SAVE() }}></p>
			<a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
				{LL.LEARN_REACT()}
			</a>
		</header>
	)
}

export default App
