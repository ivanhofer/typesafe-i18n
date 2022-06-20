import { createEffect, createSignal, Show } from 'solid-js'
import { localStorageDetector } from 'typesafe-i18n/detectors'
import Child from './Child'
import TypesafeI18n from './i18n/i18n-solid'
import { detectLocale } from './i18n/i18n-util'
import { loadLocaleAsync } from './i18n/i18n-util.async'

const detectedLocale = detectLocale(localStorageDetector)

function App() {
	const [wasLoaded, setWasLoaded] = createSignal(false)

	createEffect(() => {
		loadLocaleAsync(detectedLocale).then(() => setWasLoaded(true))
	})

	return (
		<Show when={wasLoaded()}>
			<TypesafeI18n locale={detectedLocale}>
				<div class="App">
					<Child />
				</div>
			</TypesafeI18n>
		</Show>
	)
}

export default App
