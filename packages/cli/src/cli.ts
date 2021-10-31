import { Command } from 'commander'
import { startGenerator } from 'packages/generator/src/generator'
import { version } from '../../../package.json'

const program = new Command()

program.name('typesafe-i18n')
program.description('CLI to read the base translation file and generate types')

program.option('--no-watch', 'run the generator only once (CI)')
// program.option('--setup', 'step-by-step setup')

program.version(version)

program.parse(process.argv)
const options = program.opts()

if (options.setup) {
	// TODO
} else {
	startGenerator(undefined, options['watch'])
}
