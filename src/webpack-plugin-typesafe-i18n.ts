import { Compiler, node } from 'webpack'
import { GeneratorConfig } from './generator/generator'
import { startWatcher } from './generator/watcher'

let started = false

export default class TypesafeI18nWebpackPlugin implements node.NodeTargetPlugin {
	config?: GeneratorConfig

	constructor(config?: GeneratorConfig) {
		this.config = config
	}

	apply(compiler: Compiler): void {
		compiler.hooks.compile.tap('TypesafeI18nWebpackPlugin', () => {
			if (started) return

			startWatcher(this.config)
			started = true
		})
	}
}
