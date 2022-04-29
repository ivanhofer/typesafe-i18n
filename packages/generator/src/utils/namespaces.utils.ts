import glob from 'tiny-glob/sync.js'
import { isTruthy } from 'typesafe-utils'
import type { Locale } from '../../../runtime/src/core'

const REGEX_BACKSLASHES = /\\/g

export const findAllNamespacesForLocale = (locale: Locale, outputPath: string): string[] => {
	try {
		return glob(`${outputPath}/${locale}/*/index.*s`)
			.map((file) => {
				const parts = file.replace(REGEX_BACKSLASHES, '/').split('/')
				return parts[parts.length - 2] as string
			})
			.filter(isTruthy)
	} catch (ignore) {
		return []
	}
}

// --------------------------------------------------------------------------------------------------------------------

export const getTypeNameForNamespace = (namespace: string) => {
	const transformedNamespace = namespace
		.split(/[\s_-]/g)
		.map((part) => `${part.substring(0, 1).toUpperCase()}${part.substring(1)}`)
		.join('')

	return `Namespace${transformedNamespace}Translation`
}
