import { getI18nSvelteStore } from './adapters/svelte'

const { initI18n, setLocale, isLoadingLocale, locale, LL } = getI18nSvelteStore()

export { initI18n, setLocale, isLoadingLocale, locale, LL }

export default LL
