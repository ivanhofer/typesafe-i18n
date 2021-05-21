export { detectLocale } from './detect'

export { initAcceptLanguageHeaderDetector } from './detectors/accept-language-header'
export { documentCookieDetector, initDocumentCookieDetector } from './detectors/document-cookie'
export { htmlLangAttributeDetector } from './detectors/html-lang-attribute'
export { navigatorDetector } from './detectors/navigator'
export { initQueryStringDetector, queryStringDetector } from './detectors/query-string'
export { initRequestCookiesDetector } from './detectors/request-cookies'
export { initRequestParametersDetector } from './detectors/request-parameters'
