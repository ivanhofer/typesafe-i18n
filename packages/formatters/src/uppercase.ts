import type { FormatterFunction } from '@typesafe-i18n/runtime/core.mjs'

export default ((value) => value?.toUpperCase()) as FormatterFunction<string, string>
