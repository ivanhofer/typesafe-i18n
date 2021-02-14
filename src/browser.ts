import { i18nString } from './core/util.string'
import { i18nObject } from './core/util.object'
import { i18n } from './core/util.instance'
// import { langaugeLoader, langaugeLoaderAsync } from './core/util.loader'

//@ts-ignore
window.langauge = {
	init: i18n,
	initStringWrapper: i18nString,
	initObjectWrapper: i18nObject,
	// initLoader: langaugeLoader,
	// initLoaderAsync: langaugeLoaderAsync,
}
