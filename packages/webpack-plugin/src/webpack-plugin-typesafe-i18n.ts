import { Compiler, node } from 'webpack'
import { GeneratorConfig } from '@typesafe-i18n/generator/src/generator'
import { startWatcher } from '@typesafe-i18n/generator/src/watcher'

let started = false

export default class TypesafeI18nWebpackPlugin implements node.NodeTargetPlugin {
	config?: GeneratorConfig

	constructor(config?: GeneratorConfig) {
		this.config = config
	}

	apply(compiler: Compiler): void {
		if ((compiler.options.mode || process.env.NODE_ENV) === 'production') {
			return
		}

		compiler.hooks.compile.tap('TypesafeI18nWebpackPlugin', () => {
			if (started) return

			startWatcher(this.config)
			started = true
		})
	}
}
