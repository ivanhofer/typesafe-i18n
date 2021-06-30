import type { FormatterFunction } from '../../core/src/core'

export default ((value) => value?.toUpperCase()) as FormatterFunction<string, string>
