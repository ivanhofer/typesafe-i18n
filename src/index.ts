export type { Config, LangaugeBaseTranslation, ConfigWithFormatters } from './types/types'

export type { LocaleTranslations } from './core/util'

export { langauge } from './core/core'

export { getLangaugeInstance, initLangauge } from './core/util'

export { generateTypes } from './types-generator/generator'

export { startWatcher } from './types-generator/watcher'
