<script lang="ts">
	import { localStorageDetector } from 'typesafe-i18n/detectors'
	import { onMount } from 'svelte'

	import LL, { initI18n, locale, setLocale } from './i18n/i18n-svelte'
	import type { Locales } from './i18n/i18n-types'
	import { detectLocale, locales } from './i18n/i18n-util'

	export let name: string

	onMount(async () => {
		const detectedLocale = detectLocale(localStorageDetector)
		await initI18n(detectedLocale)
		console.log(LL.STARTUP())
		localeToSelect = $locale
	})

	let localeToSelect: Locales
	$: localeToSelect && setLocale(localeToSelect)

	$: $locale && localStorage.setItem('lang', $locale)

	let nrOfApples = 1
	let nrOfBananas = 2

</script>

<main>
	<label>
		{$LL.SELECTED_LOCALE()}
		<select bind:value={localeToSelect}>
			<option value="" selected disabled>{$LL.CHOOSE_LOCALE()}</option>
			{#each locales as locale}
				<option value={locale}>{locale}</option>
			{/each}
		</select>
	</label>

	<hr />

	<h1>{$LL.HI({ name })}</h1>
	<p>{@html $LL.TUTORIAL({ link: 'https://svelte.dev/tutorial' })}</p>

	<hr />

	{$LL.TODAY({ date: new Date() })}

	<label>
		{$LL.YOUR_NAME()}
		<input type="text" bind:value={name} />
	</label>

	<hr />

	<label>
		{$LL.APPLES_LABEL()}:
		<input type="number" bind:value={nrOfApples} min={0} />
	</label>

	<label>
		{$LL.BANANAS_LABEL()}:
		<input type="number" bind:value={nrOfBananas} min={0} />
	</label>

	{$LL.FRUITS({ nrOfApples, nrOfBananas })}
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	label,
	hr {
		margin: 30px;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}

</style>
