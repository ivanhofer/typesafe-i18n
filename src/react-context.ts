import { getReactHelpers } from './adapters/react'

const { initI18n, context: I18nContext } = getReactHelpers()

export { initI18n, I18nContext }

export default I18nContext
