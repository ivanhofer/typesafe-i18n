import { logger } from '../../generator/src/utils/logger.mjs'
import { version } from '../../version'
import { readRawConfig, writeConfigToFile } from './config.mjs'

export const checkAndUpdateSchemaVersion = async (configPath = '.typesafe-i18n.json') => {
	const config = await readRawConfig(configPath)

	if (!config.$schema) return

	if (config.$schema.includes(version)) return

	await writeConfigToFile(config, configPath)

	logger.info(`updated '$schema' version of '${configPath}' to '${version}'`)
}
