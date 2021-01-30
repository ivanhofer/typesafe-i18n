import type { LangaugeBaseFormatters, LangaugeBaseTranslation, LangaugeBaseTranslationArgs } from './core/core'
import type { Writable } from 'svelte/store'
import { derived, writable } from 'svelte/store'
import { langaugeObjectWrapper } from './core/util.object'

type GetTranslationCallback = (locale: string) => Promise<LangaugeBaseTranslation> | LangaugeBaseTranslation
type InitFormattersCallback = (locale: string) => LangaugeBaseFormatters

const currentLocale = writable<string>('')

const isLoading = writable<boolean>(true)

let langaugeInstance = new Proxy({}, { get: (_target, key: string) => () => key })

const langaugeInstanceStore = writable<LangaugeBaseTranslationArgs>(langaugeInstance)

let getTranslationForLocale: GetTranslationCallback
let initFormatters: InitFormattersCallback

export const initLangauge = async (
	newlocale: string,
	getTranslationForLocaleCallback: GetTranslationCallback,
	initFormattersCallback?: InitFormattersCallback,
): Promise<void> => {
	initFormatters = initFormattersCallback || (() => ({}))
	getTranslationForLocale = getTranslationForLocaleCallback
	await setLocale(newlocale)
}

export const setLocale = async (newlocale: string): Promise<void> => {
	if (!newlocale) return

	isLoading.set(true)

	const langaugeTranslation: LangaugeBaseTranslation = await getTranslationForLocale(newlocale)
	langaugeInstance = langaugeObjectWrapper(newlocale, langaugeTranslation, initFormatters(newlocale))
	langaugeInstanceStore.set(langaugeInstance)

	currentLocale.set(newlocale)

	isLoading.set(false)
}

export const locale = derived<Writable<string>, string>(currentLocale, (newlocale: string) => newlocale)

export const isLoadingLocale = derived<Writable<boolean>, boolean>(
	isLoading,
	(loading: boolean, set: (value: boolean) => void) => set(loading),
)

export const LL = new Proxy({} as any, {
	get: (_target, key: string & 'subscribe') =>
		key === 'subscribe' ? langaugeInstanceStore.subscribe : langaugeInstance[key],
})

export default LL
