export const removeEmptyValues = <T>(object: T): T =>
	Object.fromEntries(
		Object.entries(object)
			.map(([key, value]) => value && value != '0' && [key, value])
			.filter(Boolean),
	) as T
