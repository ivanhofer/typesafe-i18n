import type { FormatterFunction } from '../../runtime/src/core'

export default ((value) => value?.toUpperCase()) as FormatterFunction<string, string>
