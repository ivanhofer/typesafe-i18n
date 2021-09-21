// This file was auto-generated by 'typesafe-i18n'. Any manual changes will be overwritten.
// @ts-check
/* eslint-disable */

import { Injectable } from '@angular/core'
import { I18nServiceRoot } from 'typesafe-i18n/angular/angular-service'
import { initFormatters } from './formatters-template.actual.js'
import { Formatters, Locales, Translation, TranslationFunctions } from './i18n-types'
import { baseLocale, getTranslationForLocale } from './util.actual.js'

@Injectable({
	providedIn: 'root',
})
export class I18nService extends I18nServiceRoot<Locales, Translation, TranslationFunctions, Formatters> {
	constructor() {
		super(baseLocale, getTranslationForLocale, initFormatters)
	}
}
