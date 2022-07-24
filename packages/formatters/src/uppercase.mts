import type { FormatterFunction } from '../../runtime/src/core.mjs'

export default ((value) => value?.toUpperCase()) as FormatterFunction<string, string>
