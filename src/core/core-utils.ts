import { isArray } from 'typesafe-utils'
import { InjectorPart, PluralPart } from './parser'

export const removeEmptyValues = <T>(object: T): T =>
	Object.fromEntries(
		Object.entries(object)
			.map(([key, value]) => key !== 'i' && value && value != '0' && [key, value])
			.filter(Boolean),
	) as T

export const trimAllValues = <T extends InjectorPart | PluralPart>(part: T): T => {
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
