import type { GetStaticProps, NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { ChangeEventHandler, useContext, useState } from 'react'
import { I18nContext } from '../src/i18n/i18n-react'
import type { Locales } from '../src/i18n/i18n-types'
import { loadedLocales, locales } from '../src/i18n/i18n-util'
import { loadLocaleAsync } from '../src/i18n/i18n-util.async'

// You need to fetch the locale and pass it to the page props.
// Unfortunately this cannot be done in a global way.
// This needs to be done for each page you create.
// The best option is to create a custom function and use it in getStaticProps.
const getI18nProps: GetStaticProps = async (context) => {
	const locale = context.locale as Locales
	await loadLocaleAsync(locale)

	return {
		props: {
			i18n: {
				locale: locale,
				dictionary: loadedLocales[locale],
			},
		},
	}
}

export const getStaticProps = getI18nProps

const Home: NextPage = () => {
	const { locale, LL, setLocale } = useContext(I18nContext)

	const router = useRouter()

	const [name, setName] = useState('John')

	const onLocaleSelected: ChangeEventHandler<HTMLSelectElement> = async ({ target }) => {
		const locale = target.value as Locales
		localStorage.setItem('lang', locale)
		await loadLocaleAsync(locale)
		setLocale(locale)
		router.push({}, {}, { locale })
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

			<Image src="/logo.svg" className="App-logo" alt="logo" width={300} height={300} />

			<p dangerouslySetInnerHTML={{ __html: LL.EDIT_AND_SAVE() }}></p>
			<Link className="App-link" href="https://nextjs.org" target="_blank" rel="noopener noreferrer">
				{LL.LEARN_REACT()}
			</Link>
		</header>
	)
}

export default Home
