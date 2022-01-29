import type { GeneratorConfigWithDefaultValues } from '../../../config/src/types'
import { writeFileIfContainsChanges } from '../file-utils'
import { prettify } from '../generator-util'
import { OVERRIDE_WARNING, relativeFileImportPath, tsCheck } from '../output-handler'

const getNodeUtils = ({ utilFileName, banner }: GeneratorConfigWithDefaultValues) => {
	return `${OVERRIDE_WARNING}${tsCheck}
${banner}

import { i18n } from '${relativeFileImportPath(utilFileName)}'

export const L = i18n()

export default L
`
}

export const generateNodeAdapter = async (config: GeneratorConfigWithDefaultValues): Promise<void> => {
	const { outputPath } = config

	const nodeUtils = getNodeUtils(config)

	const fileName = config.adapterFileName || 'i18n-node'
	await writeFileIfContainsChanges(outputPath, fileName, prettify(nodeUtils))
}
