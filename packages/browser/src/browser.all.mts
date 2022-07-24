import { i18n } from '@typesafe-i18n/runtime/util.instance.mjs'
import { i18nObject, typesafeI18nObject } from '@typesafe-i18n/runtime/util.object.mjs'
import { i18nString, typesafeI18nString } from '@typesafe-i18n/runtime/util.string.mjs'

//@ts-ignore
window.typesafeI18n = {
	i18n,
	i18nString,
	typesafeI18nString,
	i18nObject,
	typesafeI18nObject,
}
