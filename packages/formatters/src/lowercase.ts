import type { FormatterFunction } from '../../core/src/core'

export const lowercase: FormatterFunction<string, string> = (value): string => value?.toLowerCase()
