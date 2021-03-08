import { isPluralPart } from './core'
import type { ArgumentPart, Part, PluralPart } from './parser'

export const removeEmptyValues = <T>(object: T): T =>
	Object.fromEntries(
		Object.entries(object)
			.map(([key, value]) => key !== 'i' && value && value != '0' && [key, value])
			.filter(Boolean),
	) as T

export const trimAllValues = <T extends ArgumentPart | PluralPart>(part: T): T => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const trimmedObject: any = {} as T
	Object.keys(part).forEach((key) => {
		const val = (part[key as keyof T] as unknown) as string | string[]
		if (Array.isArray(val)) {
			trimmedObject[key] = val.map((v) => v?.trim())
			return
		}
		trimmedObject[key] = val?.trim()
	})

	return trimmedObject
}

export const partsAsStringWithoutTypes = (parts: Part[]): string => parts.map(partAsStringWithoutTypes).join('')

export const partAsStringWithoutTypes = (part: Part): string => {
	if (typeof part === 'string') {
		return part
	}

	if (isPluralPart(part)) {
		return `{{${[part.z, part.o, part.t, part.f, part.m, part.r].filter((value) => value !== '').join('|')}}}`
	}

	return `{${part.k}${part.f?.length ? `|${part.f.join('|')}` : ''}}`
}
