import { createSignal, JSX } from 'solid-js'
import './App.css'
import { useI18nContext } from './i18n/i18n-solid'
import type { Locales } from './i18n/i18n-types'
import { locales } from './i18n/i18n-util'
import { loadLocaleAsync } from './i18n/i18n-util.async'
import logo from './logo.svg'

function Child() {
	const { locale, LL, setLocale } = useI18nContext()

	const [name, setName] = createSignal('John')

	const onLocaleSelected: JSX.DOMAttributes<HTMLSelectElement>['onChange'] = async ({ target }) => {
		const locale = (target as HTMLInputElement).value as Locales
		localStorage.setItem('lang', locale)
		await loadLocaleAsync(locale)
		setLocale(locale)
	}

	const onNameChange: JSX.DOMAttributes<HTMLInputElement>['onInput'] = ({ target }) =>
		setName((target as HTMLInputElement).value)

	return (
		<header class="header">
			{locale}
			<label>
				{LL().SELECTED_LOCALE()}
				<select onChange={onLocaleSelected}>
					<option value="" disabled>
						{LL().CHOOSE_LOCALE()}
					</option>
					{locales.map((loc) => (
						<option value={loc} selected={locale() === loc}>
							{loc}
						</option>
					))}
				</select>
			</label>

			<hr />

			{LL().HI({ name: name() })}
			<label>
				{LL().YOUR_NAME()}
				<input type="text" value={name()} onInput={onNameChange} />
			</label>

			<hr />

			{LL().TODAY({ date: new Date() })}

			<hr />

			<img src={logo} class="logo" alt="logo" />

			<p innerHTML={LL().EDIT_AND_SAVE()} />
			<a class="link" href="https://github.com/solidjs/solid" target="_blank" rel="noopener noreferrer">
				{LL().LEARN_SOLID()}
			</a>
		</header>
	)
}

export default Child
