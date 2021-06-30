import type { FormatterFunction } from '../../core/src/core'

export default ((value) => value?.toLowerCase()) as FormatterFunction<string, string>
