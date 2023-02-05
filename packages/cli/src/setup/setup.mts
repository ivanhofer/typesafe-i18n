import { diff as justDiff } from 'just-diff'
import { diffApply as justDiffApply } from 'just-diff-apply'
import kleur from 'kleur'
import { isPropertyNotUndefined } from 'typesafe-utils'
import { doesConfigFileExist, getConfigWithDefaultValues, writeConfigToFile } from '../../../config/src/config.mjs'
import type { GeneratorConfig } from '../../../config/src/types.mjs'
import { logger } from '../../../generator/src/utils/logger.mjs'
import { getDefaultConfig } from './detect-setup.mjs'
import { askConfigQuestions, askOverrideQuestion } from './questions.mjs'
import { getRuntimeObject } from './runtimes/inde.mjs'

// --------------------------------------------------------------------------------------------------------------------

const getConfigDiff = async (options: GeneratorConfig) => {
	const { baseLocale, adapter, esmImports, outputFormat, outputPath } = await getConfigWithDefaultValues({}, false)

	const diff = justDiff({ baseLocale, adapter, esmImports, outputFormat, outputPath }, options)

	const changedValues =
		justDiffApply(
			{
				baseLocale: undefined,
				adapter: undefined,
				esmImports: undefined,
				outputFormat: undefined,
				outputPath: undefined,
			} as unknown as GeneratorConfig,
			diff,
		) || {}

	return Object.fromEntries(Object.entries(changedValues).filter(isPropertyNotUndefined('1')))
}

// --------------------------------------------------------------------------------------------------------------------

const installDependencies = async (): Promise<boolean> => {
	const runtime = await getRuntimeObject()
	if (!runtime) {
		logger.error(`Could not detect 'Node.js' or 'deno' project root. You have to install 'typesafe-i18n' by yourself`)
		return false
	}

	return runtime.install()
}

// --------------------------------------------------------------------------------------------------------------------

const highlightedInfoLog = (message: string) => logger.info(kleur.yellow(message))

const showSponsoringMessage = () =>
	// eslint-disable-next-line no-console
	console.log(`
If you are using this project in a commercial environment please consider sponsoring 'typesafe-i18n':
https://github.com/sponsors/ivanhofer
`)

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
			'See this link for more information on how to setup this project: https://github.com/ivanhofer/typesafe-i18n/tree/main/packages/generator#options',
		)

	const defaultConfig = await getDefaultConfig()

	const answers: GeneratorConfig = autoSetup ? defaultConfig : await askConfigQuestions(defaultConfig)
	const options = { ...defaultConfig, ...answers } as GeneratorConfig

	const config = await getConfigDiff(options)

	await writeConfigToFile(config)
	logger.info(`generated config file: '.typesafe-i18n.json'`)

	const installed = await installDependencies()
	if (!installed) {
		showSponsoringMessage()
		return
	}

	logger.info('setup complete')

	const runtime = await getRuntimeObject()
	if (!runtime) {
		return
	}

	const commandToRun =
		runtime.type === 'node' ? 'npm run typesafe-i18n' : runtime.type === 'deno' ? 'deno run -A npm:typesafe-i18n' : ''

	commandToRun && highlightedInfoLog(`You can now run '${commandToRun}' to start the generator`)

	showSponsoringMessage()
}
