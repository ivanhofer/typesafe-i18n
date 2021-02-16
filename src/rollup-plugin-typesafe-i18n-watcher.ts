import { startWatcher } from './types-generator/watcher'
import type { Plugin } from 'rollup'
import type { GeneratorConfig } from './types-generator/generator'

let started = false

const plugin = (config?: GeneratorConfig): Plugin => {
	return {
		name: 'rollup-plugin-typesafe-i18n-watcher',
		buildStart() {
			if (started) return

			startWatcher(config)
			started = true
		},
	}
}

export default plugin
