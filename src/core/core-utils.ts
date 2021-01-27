import { isArray, isNotEmpty, isString } from 'typesafe-utils'
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
		if (isArray(val)) {
			trimmedObject[key] = val.map((v) => v?.trim())
			return
		}
		trimmedObject[key] = val?.trim()
	})

	return trimmedObject
}

export const asStringWithoutTypes = (parts: Part[]): string =>
	parts
		.map((part) => {
			if (isString(part)) {
				return part
			}

			if (isPluralPart(part)) {
				return `{{${[part.z, part.o, part.t, part.f, part.m, part.r].filter(isNotEmpty).join('|')}}}`
			}

			return `{${part.k}${part.f?.length ? `|${part.f.join('|')}` : ''}}`
		})
		.join('')
