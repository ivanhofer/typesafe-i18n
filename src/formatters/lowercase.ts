import type { FormatterFn } from './_types'

export const lowercase: FormatterFn<string> = (value: string): string => value?.toLowerCase()
