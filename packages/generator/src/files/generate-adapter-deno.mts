import type { GeneratorConfigWithDefaultValues } from '../../../config/src/types.mjs'
import { writeFileIfContainsChanges } from '../utils/file.utils.mjs'
import { prettify } from '../utils/generator.utils.mjs'
import { getNodeUtils } from './generate-adapter-node.mjs'

export const generateDenoAdapter = async (config: GeneratorConfigWithDefaultValues): Promise<void> => {
	const { outputPath } = config

	const nodeUtils = getNodeUtils(config)

	const fileName = config.adapterFileName || 'i18n-deno'
	await writeFileIfContainsChanges(outputPath, fileName, prettify(nodeUtils))
}
