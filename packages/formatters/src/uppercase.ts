import type { FormatterFunction } from './_types'

export const uppercase: FormatterFunction<string> = (value): string => value?.toUpperCase()
