import type { FormatterFunction } from './_types'

export const uppercase: FormatterFunction = (value: string): string => value?.toUpperCase()
