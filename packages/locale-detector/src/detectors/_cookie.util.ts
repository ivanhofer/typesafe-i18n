import type { Locale } from '../../../core/src/core'

export const parseValueFromCookie = (cookieValue: string, key: string): Locale[] => {
	const value = cookieValue
		?.split(';')
		.map((part) => part.trim())
		.find((part) => part.startsWith(key))
		?.split('=')[1]

	return value ? [value] : []
}
