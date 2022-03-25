import { Component } from '@angular/core'
import { loadLocaleAsync } from 'src/i18n/i18n-util.async'
import { localStorageDetector } from 'typesafe-i18n/detectors'
import { Locales, TranslationFunctions } from '../i18n/i18n-types'
import { detectLocale, locales } from '../i18n/i18n-util'
import { I18nService } from '../i18n/i18n.service'

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent {
	title = 'angular'

	selectedLocale: Locales

	locales = locales

	now = new Date()

	nrOfApples = 1
	nrOfBananas = 2

	constructor(private i18nService: I18nService) {
		this.selectedLocale = detectLocale(localStorageDetector)
		this.setLocale().then(() => {
			// eslint-disable-next-line no-console
			console.log(this.LL.STARTUP())
		})
	}

	get LL(): TranslationFunctions {
		return this.i18nService.LL
	}

	async setLocale(): Promise<void> {
		await loadLocaleAsync(this.selectedLocale)
		this.i18nService.setLocale(this.selectedLocale)
		localStorage.setItem('lang', this.selectedLocale)
	}
}
