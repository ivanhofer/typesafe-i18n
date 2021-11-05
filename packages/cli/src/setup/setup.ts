// --------------------------------------------------------------------------------------------------------------------
import { diff as justDiff } from 'just-diff'
import justDiffApply from 'just-diff-apply'
import kleur from 'kleur'
import { startGenerator } from 'packages/generator/src/generator'
import { isPropertyNotUndefined } from 'typesafe-utils'
import {
	doesConfigFileExist,
	GeneratorConfig,
	getConfigWithDefaultValues,
	writeConfigToFile,
} from '../../../generator/src/generate-files'
import { logger } from '../../../generator/src/generator-util'
import { getDefaultConfig } from './detect-setup'
import { updatePackageJson } from './package-json'
import { askConfigQuestions, askOverrideQuestion } from './questions'

// --------------------------------------------------------------------------------------------------------------------

const getConfigDiff = async (options: GeneratorConfig) => {
	const { baseLocale, adapter, loadLocalesAsync, esmImports, outputFormat, outputPath } =
		await getConfigWithDefaultValues({}, false)

	const diff = justDiff({ baseLocale, adapter, loadLocalesAsync, esmImports, outputFormat, outputPath }, options)

	const changedValues = justDiffApply.diffApply(
		{
			baseLocale: undefined,
			adapter: undefined,
			loadLocalesAsync: undefined,
			esmImports: undefined,
			outputFormat: undefined,
			outputPath: undefined,
		} as GeneratorConfig,
		diff,
	)

	return Object.fromEntries(Object.entries(changedValues).filter(isPropertyNotUndefined('1')))
}

// --------------------------------------------------------------------------------------------------------------------

export const setup = async (autoSetup: boolean) => {
	const exists = await doesConfigFileExist()
	if (exists) {
		if (autoSetup) {
			logger.warn(`Config file '.typesafe-i18n.json' exists already. Nothing to set up.`)
			return
		}

		const { override } = await askOverrideQuestion()
		if (!override) {
			logger.info('setup aborted')
			return
		}
	}

	!autoSetup &&
		logger.info(
			kleur.yellow(
				'See this link for more information on how to setup this project: https://github.com/ivanhofer/typesafe-i18n#options',
			),
		)

	const defaultConfig = await getDefaultConfig()

	const answers: GeneratorConfig = autoSetup ? defaultConfig : await askConfigQuestions(defaultConfig)
	const options = { ...defaultConfig, ...answers }

	const config = await getConfigDiff(options)

	await writeConfigToFile(config)

	await updatePackageJson()

	await startGenerator(undefined, false)

	logger.info('setup complete')
}
