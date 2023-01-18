import { isPluralPart, isTextPart } from '../../parser/src/advanced/parse.mjs'
import { serializePluralPart } from '../../parser/src/advanced/serialize.mjs'
import type { ParsedMessage, ParsedMessagePart, TransformParameterPart } from '../../parser/src/advanced/types.mjs'
import type { TranslationFunctions } from './core.mjs'

export const partsAsStringWithoutTypes = (parts: ParsedMessage): string => parts.map(partAsStringWithoutTypes).join('')

// --------------------------------------------------------------------------------------------------------------------

export const partAsStringWithoutTypes = (part: ParsedMessagePart): string => {
	if (isTextPart(part)) return part.content

	if (isPluralPart(part)) return serializePluralPart(part)

	return `{${part.key}${part.optional ? '?' : ''}${
		part.transforms.length ? `|${part.transforms.map(transformPartAsString).join('|')}` : ''
	}}`
}

const transformPartAsString = (transform: TransformParameterPart) =>
	transform.kind === 'formatter' ? transform.name : transform.raw

// --------------------------------------------------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getFallbackProxy = <TF extends TranslationFunctions<any>>(): TF =>
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	new Proxy(Object.assign(() => '', {}) as any, {
		get: (_target, key: string) => (key === 'length' ? 0 : getFallbackProxy()),
	})
