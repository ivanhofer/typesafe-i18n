import type { FormatterFunction } from './_types'

export const identity: FormatterFunction = <T>(value: T): T => value
