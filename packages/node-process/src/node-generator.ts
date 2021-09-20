import { logger } from 'packages/generator/src/generator-util'
import { startGenerator } from '../../generator/src/generator'

type AllowedArguments = '--no-watch'

const allowedArguments: AllowedArguments[] = ['--no-watch']

const [, , ...args] = process.argv as [string, string, ...AllowedArguments[]]

args.forEach((arg) => {
	if (!allowedArguments.includes(arg)) {
		logger.error(`unknown argument '${arg}'`)
		logger.info(`allowed arguments: ${allowedArguments.map((arg) => `'${arg}'`).join(', ')}`)
		process.exit(1)
	}
})

const watchFiles = !args.includes('--no-watch')

startGenerator(undefined, watchFiles)
