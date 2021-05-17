import type { FormatterFunction } from './_types'

export const lowercase: FormatterFunction<string, string> = (value): string => value?.toLowerCase()
