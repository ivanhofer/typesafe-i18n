<script context="module" lang="ts">
	import type { Locales } from '$i18n/i18n-types'
	import { baseLocale, locales } from '$i18n/i18n-util'
	import { initI18n } from '$i18n/i18n-svelte'
	import type { Load } from '@sveltejs/kit'
	import { replaceLocaleInUrl } from '../utils'

	export const load: Load = async ({ page, session }) => {
		const lang = page.params.lang as Locales

		// redirect to preferred language if user comes from page root
		if (!lang) {
			return {
				status: 302,
				redirect: `/${session.locale}`,
			}
		}

		// delete session locale since we don't need it to be sent to the client
		delete session.locale

		// redirect to base locale if language is not present
		if (!locales.includes(lang)) {
			return {
				status: 302,
				redirect: replaceLocaleInUrl(page.path, baseLocale),
			}
		}

		// load dictionary data
		await initI18n(lang)

		return {}
	}
</script>

<script lang="ts">
	import LocaleSwitcher from '$lib/LocaleSwitcher.svelte'
</script>

<LocaleSwitcher />

<slot />
