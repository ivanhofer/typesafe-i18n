import { checkAndUpdateSchemaVersion } from '@typesafe-i18n/config/update-schema-version.mjs'
import { startGenerator } from '@typesafe-i18n/generator/generator.mjs'
import { logger } from '@typesafe-i18n/generator/utils/logger.mjs'
import { Command } from 'commander'
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
