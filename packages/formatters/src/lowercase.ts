import type { FormatterFunction } from '../../runtime/src/core'

export default ((value) => value?.toLowerCase()) as FormatterFunction<string, string>
