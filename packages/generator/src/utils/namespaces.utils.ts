import { sync as glob } from 'glob'
import type { Locale } from '../../../runtime/src/core'

export const findAllNamespacesForLocale = (locale: Locale, outputPath: string): string[] =>
	glob(`${outputPath}/${locale}/*/index.*s`).map((file) => {
		// TODO: check if this split also works for windows-paths
		const parts = file.split('/')
		return parts[parts.length - 2] as string
	})

// --------------------------------------------------------------------------------------------------------------------

export const getTypeNameForNamespace = (namespace: string) => {
	const transformedNamespace = namespace
		.split(/[\s_-]/g)
		.map((part) => `${part.substring(0, 1).toUpperCase()}${part.substring(1)}`)
		.join('')

	return `Namespace${transformedNamespace}Translation`
}
