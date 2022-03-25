import { navigatorDetector } from 'typesafe-i18n/detectors'
import { createApp } from 'vue'
import App from './App.vue'
import { detectLocale } from './i18n/i18n-util'
import { loadLocaleAsync } from './i18n/i18n-util.async'
import { i18nPlugin } from './i18n/i18n-vue'

const app = createApp(App)

// detect user's preferred locale
const detectedLocale = detectLocale(navigatorDetector)

loadLocaleAsync(detectedLocale).then(() => {
	// activate i18n plugin
	app.use(i18nPlugin, detectedLocale)
	app.mount('#app')
})
