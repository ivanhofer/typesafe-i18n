import pluginOptimizer from './rollup-plugin-typesafe-i18n-optimizer'
import pluginWatcher from './rollup-plugin-typesafe-i18n-watcher'

const production = !process.env.ROLLUP_WATCH

const plugin = production ? pluginOptimizer : pluginWatcher

export default plugin
