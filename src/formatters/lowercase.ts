import type { FormatterFunction } from './_types'

export const lowercase: FormatterFunction<string> = (value): string => value?.toLowerCase()
