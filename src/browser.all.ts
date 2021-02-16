import { i18nString } from './core/util.string'
import { i18nObject } from './core/util.object'
import { i18n } from './core/util.instance'
// import { i18nLoader, i18nLoaderAsync } from './core/util.loader'

//@ts-ignore
window.i18n = {
	init: i18n,
	initStringWrapper: i18nString,
	initObjectWrapper: i18nObject,
	// initLoader: i18nLoader,
	// initLoaderAsync: i18nLoaderAsync,
}
