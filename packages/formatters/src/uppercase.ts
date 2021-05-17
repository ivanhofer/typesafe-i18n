import type { FormatterFunction } from '../../core/src/core'

export const uppercase: FormatterFunction<string, string> = (value): string => value?.toUpperCase()
