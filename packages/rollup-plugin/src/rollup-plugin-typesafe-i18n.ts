import pluginOptimizer from './rollup-plugin-typesafe-i18n-optimizer'
import pluginGenerator from './rollup-plugin-typesafe-i18n-generator'

const production = !process.env.ROLLUP_WATCH

const plugin = production ? pluginOptimizer : pluginGenerator

export default plugin
