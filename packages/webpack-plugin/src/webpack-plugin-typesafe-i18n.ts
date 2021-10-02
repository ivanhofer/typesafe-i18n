import { Compiler, node } from 'webpack'
import { startGenerator } from '../../generator/src/generator'
import { createLogger } from '../../generator/src/generator-util'

const logger = createLogger(console, true)

let started = false

export default class TypesafeI18nWebpackPlugin implements node.NodeTargetPlugin {
	constructor(config?: never) {
		if (config) {
			logger.error(
				'Deprecated config. Please use the `.typesafe-i18n.json`-file instead. See https://github.com/ivanhofer/typesafe-i18n#options',
			)
		}
	}

	apply(compiler: Compiler): void {
		if ((compiler.options.mode || process.env.NODE_ENV) === 'production') {
			return
		}

		compiler.hooks.compile.tap('TypesafeI18nWebpackPlugin', () => {
			if (started) return

			startGenerator()
			started = true
		})
	}
}
