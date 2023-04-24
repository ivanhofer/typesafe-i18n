import { Command, Option } from 'commander'
import { checkAndUpdateSchemaVersion } from '../../config/src/update-schema-version.mjs'
import { startGenerator } from '../../generator/src/generator.mjs'
import { logger } from '../../generator/src/utils/logger.mjs'
import { version } from '../../version'
import { setup } from './setup/setup.mjs'

const program = new Command()

program.name('typesafe-i18n')
program.description('CLI to read the base translation file and generate types')

program.option('--no-watch', 'run the generator only once (CI)')
program.option('--setup', 'step-by-step setup')
program.option('--setup-auto', 'auto-guess setup')
program.addOption(
	new Option('-p, --project <path>', 'path to the config file').default('.typesafe-i18n.json').makeOptionMandatory(),
)

program.version(version)

const run = async () => {
	program.parse(process.argv)
	const options = program.opts()

	logger.info(`version ${version}`)

	await checkAndUpdateSchemaVersion(options.project)

	if (options.setup || options.setupAuto) {
		await setup(options.setupAuto)
	} else {
		startGenerator(options.project, options['watch'])
	}
}

run()
