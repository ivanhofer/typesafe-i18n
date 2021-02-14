import { getI18nSvelteStore } from './adapters/svelte-store'

const { initI18n, setLocale, isLoadingLocale, locale, LL } = getI18nSvelteStore()

export { initI18n, setLocale, isLoadingLocale, locale, LL }

export default LL
