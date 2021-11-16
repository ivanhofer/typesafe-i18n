import { isPluralPart, TranslationFunctions } from './core'
import type { ArgumentPart, Part, PluralPart } from './parser'

export const removeEmptyValues = <T>(object: T): T =>
	Object.fromEntries(
		Object.entries(object)
			.map(([key, value]) => key !== 'i' && value && value != '0' && [key, value])
			.filter(Boolean),
	) as T

export const trimAllValues = <T extends ArgumentPart | PluralPart>(part: T): T =>
	Object.fromEntries(
		Object.keys(part).map((key) => {
			const val = part[key as keyof T] as unknown as boolean | string | string[]
			return [
				key,
				Array.isArray(val) ? val.map((v) => v?.trim()) : val === !!val ? val : (val as string)?.trim(),
			] as const
		}),
	) as T

export const partsAsStringWithoutTypes = (parts: Part[]): string => parts.map(partAsStringWithoutTypes).join('')

export const partAsStringWithoutTypes = (part: Part): string => {
	if (typeof part === 'string') {
		return part
	}

	if (isPluralPart(part)) {
		return `{{${[part.z, part.o, part.t, part.f, part.m, part.r].filter((value) => value !== undefined).join('|')}}}`
	}

	return `{${part.k}${part.n ? '?' : ''}${part.f?.length ? `|${part.f.join('|')}` : ''}}`
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getFallbackProxy = <TF extends TranslationFunctions<any>>(prefixKey?: string): TF =>
	new Proxy((prefixKey ? () => prefixKey : {}) as TF, {
		get: (_target, key: string) => getFallbackProxy(prefixKey ? `${prefixKey}.${key}` : key),
	})
