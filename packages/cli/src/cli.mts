import { Command } from 'commander'
import { checkAndUpdateSchemaVersion } from '../../config/src/update-schema-version'
import { startGenerator } from '../../generator/src/generator'
import { logger } from '../../generator/src/utils/logger.mjs'
import { version } from '../../version'
import { setup } from './setup/setup.mjs'

const program = new Command()

program.name('typesafe-i18n')
program.description('CLI to read the base translation file and generate types')

program.option('--no-watch', 'run the generator only once (CI)')
program.option('--setup', 'step-by-step setup')
program.option('--setup-auto', 'auto-guess setup')

program.version(version)

const run = async () => {
	program.parse(process.argv)
	const options = program.opts()

	logger.info(`version ${version}`)

	await checkAndUpdateSchemaVersion()

	if (options.setup || options.setupAuto) {
		await setup(options.setupAuto)
	} else {
		startGenerator(undefined, options['watch'])
	}
}

run()
