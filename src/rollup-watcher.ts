import { startWatcher } from './types-generator/watcher'
import type { Plugin, RollupWarning } from 'rollup'
import type { GeneratorConfig } from './types-generator/generator'

let started = false

const plugin = (config: GeneratorConfig = {}): Plugin => {
	return {
		name: 'rollup-plugin-langauge-watcher',
		buildStart() {
			if (!started) {
				startWatcher(config)
				started = true
			}
		},
	}
}

export const onwarn = (warning: RollupWarning, defaultHandler?: (warning: string | RollupWarning) => void): unknown =>
	!warning.id?.includes('langauge') && defaultHandler && defaultHandler(warning)

export default plugin
