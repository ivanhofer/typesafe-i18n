import type { Plugin } from 'rollup'
import type { RollupConfig } from '../../config/src/config'
import { typesafeI18nGeneratorPlugin } from './rollup-plugin-typesafe-i18n-generator'
import { typesafeI18nOptimizerPlugin } from './rollup-plugin-typesafe-i18n-optimizer'

const production = !process.env.ROLLUP_WATCH

const plugin = (production ? typesafeI18nOptimizerPlugin : typesafeI18nGeneratorPlugin) as unknown as (
	config?: RollupConfig,
) => Plugin

export default plugin
export { plugin as typesafeI18nPlugin }
