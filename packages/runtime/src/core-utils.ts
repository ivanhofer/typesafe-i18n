import type { Part } from '../../parser/src/types'
import { isPluralPart, TranslationFunctions } from './core'

// --------------------------------------------------------------------------------------------------------------------

export const partsAsStringWithoutTypes = (parts: Part[]): string => parts.map(partAsStringWithoutTypes).join('')

// --------------------------------------------------------------------------------------------------------------------

export const partAsStringWithoutTypes = (part: Part): string => {
	if (typeof part === 'string') {
		return part
	}

	if (isPluralPart(part)) {
		return `{{${[part.z, part.o, part.t, part.f, part.m, part.r].filter((value) => value !== undefined).join('|')}}}`
	}

	return `{${part.k}${part.n ? '?' : ''}${part.f?.length ? `|${part.f.join('|')}` : ''}}`
}

// --------------------------------------------------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getFallbackProxy = <TF extends TranslationFunctions<any>>(prefixKey?: string): TF =>
	new Proxy((prefixKey ? () => prefixKey : {}) as TF, {
		get: (_target, key: string) => getFallbackProxy(prefixKey ? `${prefixKey}.${key}` : key),
	})
