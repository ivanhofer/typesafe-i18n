import { isBasicPluralPart, type BasicPart } from '../../parser/src/basic.mjs'
import type { TranslationFunctions } from './core.mjs'

// --------------------------------------------------------------------------------------------------------------------

export const partsAsStringWithoutTypes = (parts: BasicPart[]): string => parts.map(partAsStringWithoutTypes).join('')

// --------------------------------------------------------------------------------------------------------------------

export const partAsStringWithoutTypes = (part: BasicPart): string => {
	if (typeof part === 'string') {
		return part
	}

	if (isBasicPluralPart(part)) {
		return `{{${[part.z, part.o, part.t, part.f, part.m, part.r].filter((value) => value !== undefined).join('|')}}}`
	}

	return `{${part.k}${part.n ? '?' : ''}${part.f?.length ? `|${part.f.join('|')}` : ''}}`
}

// --------------------------------------------------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getFallbackProxy = <TF extends TranslationFunctions<any>>(): TF =>
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	new Proxy(Object.assign(() => '', {}) as any, {
		get: (_target, key: string) => (key === 'length' ? 0 : getFallbackProxy()),
	})

// // --------------------------------------------------------------------------------------------------------------------

// export const partsAsStringWithoutTypes = (parts: ParsedMessage): string => parts.map(partAsStringWithoutTypes).join('')

// // --------------------------------------------------------------------------------------------------------------------

// export const partAsStringWithoutTypes = (part: ParsedMessagePart): string => {
// 	if (isTextPart(part)) {
// 		return part.content
// 	}

// 	if (isPluralPart(part)) {
// 		return `{{${[part.zero, part.one, part.two, part.few, part.many, part.other].filter((value) => value !== undefined).join('|')}}}`
// 	}

// 	return `{${part.key}${part.optional ? '?' : ''}${part.transforms?.length ? `|${part.transforms.map(transformPartAsString).join('|')}` : ''}}`
// }

// const transformPartAsString = (transform: TransformParameterPart) => transform.kind === 'formatter'
// 	? transform.name
// 	: `{${Object.entries(transform.cases).map(entry => entry.join(':')).join(', ')}`

// // --------------------------------------------------------------------------------------------------------------------

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// export const getFallbackProxy = <TF extends TranslationFunctions<any>>(): TF =>
// 	// eslint-disable-next-line @typescript-eslint/no-explicit-any
// 	new Proxy(Object.assign(() => '', {}) as any, {
// 		get: (_target, key: string) => (key === 'length' ? 0 : getFallbackProxy()),
// 	})
