import type { BaseTranslation } from '@typesafe-i18n/runtime/index.mjs'
import { isString } from 'typesafe-utils'
import { NEW_LINE } from '../../constants.mjs'
import { wrapObjectKeyIfNeeded } from '../../utils/generator.utils.mjs'
import { logger } from '../../utils/logger.mjs'
import { wrapUnionType } from './_utils.mjs'

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
