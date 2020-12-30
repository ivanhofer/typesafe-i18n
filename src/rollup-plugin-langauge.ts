import { startWatcher, WatcherConfig } from './types-generator/watcher'
import type { Plugin, RollupWarning } from 'rollup'

let started = false

const plugin = (config: WatcherConfig = {}): Plugin => {
	return {
		name: 'rollup-plugin-langauge',
		buildStart() {
			if (!started) {
				startWatcher(config)
				started = true
			}
		},
	}
}

export const onwarn = (warning: RollupWarning, defaultHandler?: (warning: string | RollupWarning) => void): unknown =>
	warning.id?.includes('langauge\node_modules\typescript') && defaultHandler && defaultHandler(warning)

export default plugin
