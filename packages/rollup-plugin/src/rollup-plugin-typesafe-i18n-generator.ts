import type { Plugin } from 'rollup'
import { startGenerator } from '../../generator/src/generator'
import { validateRollupConfig } from './_validateConfig'

let started = false

const plugin = (config?: never): Plugin => {
	return {
		name: 'rollup-plugin-typesafe-i18n-generator',
		buildStart() {
			if (started) return

			validateRollupConfig(config)

			startGenerator(config)
			started = true
		},
	}
}

export default plugin
export { plugin as typesafeI18nGeneratorPlugin }
