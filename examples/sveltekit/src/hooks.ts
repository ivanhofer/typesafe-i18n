import { detectLocale } from '$i18n/i18n-util'
import type { GetSession, Handle } from '@sveltejs/kit'
import { initAcceptLanguageHeaderDetector } from 'typesafe-i18n/detectors'

export const handle: Handle = async ({ request, resolve }) => {
	const response = await resolve(request)

   // read language slug
	const [, lang] = request.path.split('/')

	return {
		...response,
      // replace html lang attribute with correct language
		body: (response.body || '').toString().replace('<html lang="en">', `<html lang="${lang}">`),
	}
}

export const getSession: GetSession = (request) => {
   // detect the preferred language the user has configured in his browser
	const acceptLanguageDetector = initAcceptLanguageHeaderDetector(request)
	const locale = detectLocale(acceptLanguageDetector)

	return {
		locale,
	}
}
