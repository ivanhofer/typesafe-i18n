import type { Plugin } from 'rollup'
import { startGenerator } from '../../generator/src/generator'
import type { GeneratorConfig } from '../../generator/src/generate-files'

let started = false

const plugin = (config?: GeneratorConfig): Plugin => {
	return {
		name: 'rollup-plugin-typesafe-i18n-generator',
		buildStart() {
			if (started) return

			startGenerator(config)
			started = true
		},
	}
}

export default plugin
