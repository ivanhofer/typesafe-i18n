import type { FormatterFunction } from './_types'

export const uppercase: FormatterFunction<string, string> = (value): string => value?.toUpperCase()
