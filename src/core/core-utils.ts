export const removeEmptyValues = <T>(object: T): T =>
	Object.fromEntries(
		Object.entries(object)
			.map(([key, value]) => key !== 't' && value && value != '0' && [key, value])
			.filter(Boolean),
	) as T
