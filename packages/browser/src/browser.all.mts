import { i18n } from '../../runtime/src/util.instance.mjs'
import { i18nObject, typesafeI18nObject } from '../../runtime/src/util.object.mjs'
import { i18nString, typesafeI18nString } from '../../runtime/src/util.string.mjs'

//@ts-ignore
window.typesafeI18n = {
	i18n,
	i18nString,
	typesafeI18nString,
	i18nObject,
	typesafeI18nObject,
}
