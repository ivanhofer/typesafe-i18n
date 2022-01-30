import type { Plugin } from 'rollup'
import { startGenerator } from '../../generator/src/generator'

let started = false

const plugin = (config?: never): Plugin => {
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
export { plugin as typesafeI18nGeneratorPlugin }
