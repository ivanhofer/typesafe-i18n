import glob from 'tiny-glob/sync.js'
import type { Locale } from '../../../runtime/src/core'

export const findAllNamespacesForLocale = (locale: Locale, outputPath: string): string[] => {
	try {
		return glob(`${outputPath}/${locale}/*/index.*s`).map((file) => {
			const parts = file.split('/')
			return parts[parts.length - 2] as string
		})
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
