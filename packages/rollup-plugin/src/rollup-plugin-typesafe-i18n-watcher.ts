import type { Plugin } from 'rollup'
import { startWatcher } from '../../generator/src/watcher'
import type { GeneratorConfig } from '../../generator/src/generate-files'

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
