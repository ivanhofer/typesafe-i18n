import type { FormatterFn } from './_types'

export const uppercase: FormatterFn<string> = (value: string): string => value?.toUpperCase()
