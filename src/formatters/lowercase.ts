import type { FormatterFunction } from './_types'

export const lowercase: FormatterFunction<string> = (value: string): string => value?.toLowerCase()
