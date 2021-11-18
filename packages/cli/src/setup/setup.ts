// --------------------------------------------------------------------------------------------------------------------
import { diff as justDiff } from 'just-diff'
import { diffApply as justDiffApply } from 'just-diff-apply'
import kleur from 'kleur'
import { isPropertyNotUndefined } from 'typesafe-utils'
import { doesConfigFileExist, getConfigWithDefaultValues, writeConfigToFile } from '../../../config/src/config'
import type { GeneratorConfig } from '../../../config/src/types'
import { logger } from '../../../generator/src/generator-util'
import { getDefaultConfig } from './detect-setup'
import { updatePackageJson } from './package-json'
import { askConfigQuestions, askOverrideQuestion } from './questions'

// --------------------------------------------------------------------------------------------------------------------

const getConfigDiff = async (options: GeneratorConfig) => {
	const { baseLocale, adapter, loadLocalesAsync, esmImports, outputFormat, outputPath } =
		await getConfigWithDefaultValues({}, false)

	const diff = justDiff({ baseLocale, adapter, loadLocalesAsync, esmImports, outputFormat, outputPath }, options)

	const changedValues = justDiffApply(
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

const highlightedInfoLog = (message: string) => logger.info(kleur.yellow(message))

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
		highlightedInfoLog(
			'See this link for more information on how to setup this project: https://github.com/ivanhofer/typesafe-i18n#options',
		)

	const defaultConfig = await getDefaultConfig()

	const answers: GeneratorConfig = autoSetup ? defaultConfig : await askConfigQuestions(defaultConfig)
	const options = { ...defaultConfig, ...answers }

	const config = await getConfigDiff(options)

	await writeConfigToFile(config)
	logger.info(`generated config file: '.typesafe-i18n.json'`)

	await updatePackageJson()

	logger.info('setup complete')

	highlightedInfoLog(`You can now run 'npm run typesafe-i18n' to start the generator`)
}
