import { logger } from 'packages/generator/src/generator-util'
import { version } from '../../version'
import { readRawConfig, writeConfigToFile } from './config'

export const checkAndUpdateSchemaVersion = async () => {
	const config = await readRawConfig()

	if (!config.$schema) return

	if (config.$schema.includes(version)) return

	await writeConfigToFile(config)

	logger.info(`updated '$schema' version of '.typesafe-i18n.json' to '${version}'`)
}
