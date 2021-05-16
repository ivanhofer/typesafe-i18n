import type { Plugin } from 'rollup'
import { startWatcher } from '@typesafe-i18n/generator/src/watcher'
import type { GeneratorConfig } from '@typesafe-i18n/generator/src/generator'

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
