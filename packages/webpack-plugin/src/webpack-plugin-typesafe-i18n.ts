import { Compiler, node } from 'webpack'
import { GeneratorConfig } from '../../generator/src/generate-files'
import { startGenerator } from '../../generator/src/generator'

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

			startGenerator(this.config)
			started = true
		})
	}
}
