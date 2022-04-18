import React, { ChangeEventHandler, useContext, useState } from 'react'
import './App.css'
import { I18nContext } from './i18n/i18n-react'
import type { Locales } from './i18n/i18n-types'
import { locales } from './i18n/i18n-util'
import { loadLocaleAsync } from './i18n/i18n-util.async'
import logo from './logo.svg'

function Child() {
	const { locale, LL, setLocale } = useContext(I18nContext)

	const [name, setName] = useState('John')

	const onLocaleSelected: ChangeEventHandler<HTMLSelectElement> = async ({ target }) => {
		const locale = target.value as Locales
		localStorage.setItem('lang', locale)
		await loadLocaleAsync(locale)
		setLocale(locale)
	}

	const onNameChange: ChangeEventHandler<HTMLInputElement> = ({ target }) => setName(target.value)

	return (
		<header className="App-header">
			<label>
				{LL.SELECTED_LOCALE()}
				<select value={locale || ''} onChange={onLocaleSelected}>
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

export default Child
