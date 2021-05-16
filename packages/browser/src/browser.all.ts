import { i18nString } from '@typesafe-i18n/core/src/util.string'
import { i18nObject } from '@typesafe-i18n/core/src/util.object'
import { i18n } from '@typesafe-i18n/core/src/util.instance'
// import { i18nLoader, i18nLoaderAsync } from '@typesafe-i18n/core/src/util.loader'

//@ts-ignore
window.typesafeI18n = {
	i18n,
	i18nString,
	i18nObject,
	// i18nLoader,
	// i18nLoaderAsync,
}
