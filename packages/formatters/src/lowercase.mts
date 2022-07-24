import type { FormatterFunction } from '../../runtime/src/core.mjs'

export default ((value) => value?.toLowerCase()) as FormatterFunction<string, string>
