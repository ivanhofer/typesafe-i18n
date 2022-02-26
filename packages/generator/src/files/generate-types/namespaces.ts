import { isString } from 'typesafe-utils'
import type { BaseTranslation } from '../../../../runtime/src'
import { NEW_LINE } from '../../constants'
import { wrapObjectKeyIfNeeded } from '../../utils/generator.utils'
import { logger } from '../../utils/logger'
import { wrapUnionType } from './_utils'

export const validateNamespaces = (translations: BaseTranslation | BaseTranslation[], namespaces: string[]) => {
	if (!namespaces.length) return

	namespaces.forEach((namespace) => {
		if (isString((translations as Record<string, unknown>)[namespace])) {
			logger.error(`namespace '${namespace}' cant be a \`string\`. Must be an \`object\` or \`Array\`.`)
		}
	})
}

export const createNamespacesTypes = (namespaces: string[]) => `
export type Namespaces =${wrapUnionType(namespaces)}

type DisallowNamespaces = {${namespaces
	.map(
		(namespace) => `
	/**
	 * reserved for '${namespace}'-namespace\\
	 * you need to use the \`./${namespace}/index.ts\` file instead
	 */
	${wrapObjectKeyIfNeeded(
		namespace,
	)}?: "[typesafe-i18n] reserved for '${namespace}'-namespace. You need to use the \`./${namespace}/index.ts\` file instead."`,
	)
	.join(NEW_LINE)}
}`
