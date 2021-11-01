import { Command } from 'commander'
import { version } from '../../../package.json'
import { startGenerator } from '../../generator/src/generator'
import { logger } from '../../generator/src/generator-util'

const program = new Command()

program.name('typesafe-i18n')
program.description('CLI to read the base translation file and generate types')

program.option('--no-watch', 'run the generator only once (CI)')
// program.option('--setup', 'step-by-step setup')

program.version(version)

program.parse(process.argv)
const options = program.opts()

logger.info(`version ${version}`)

if (options.setup) {
	// TODO
} else {
	startGenerator(undefined, options['watch'])
}
