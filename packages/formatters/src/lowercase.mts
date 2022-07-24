import type { FormatterFunction } from '@typesafe-i18n/runtime/core.mjs'

export default ((value) => value?.toLowerCase()) as FormatterFunction<string, string>
