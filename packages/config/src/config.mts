import { resolve } from 'path'
import { doesPathExist, importFile, writeConfigFile } from '../../generator/src/utils/file.utils.mjs'
import { version } from '../../version'
import { applyDefaultValues } from './core.mjs'
import type { GeneratorConfig, GeneratorConfigWithDefaultValues } from './types.mjs'
import { validateConfig } from './validation.mjs'

export const writeConfigToFile = async (config: GeneratorConfig) =>
	writeConfigFile({ ...config, $schema: `https://unpkg.com/typesafe-i18n@${version}/schema/typesafe-i18n.json` })

export const doesConfigFileExist = async () => doesPathExist(resolve('.typesafe-i18n.json'))

export const readRawConfig = async (configPath: string) =>
	(await importFile<GeneratorConfig & { $schema?: string }>(resolve(configPath), false)) || {}

export const readConfig = async (configPath = '.typesafe-i18n.json'): Promise<GeneratorConfig> => {
	const generatorConfig = await readRawConfig(configPath)

	// remove "$schema" property
	const configWithoutSchemaAttribute = Object.fromEntries(
		Object.entries(generatorConfig).filter(([key]) => key !== '$schema'),
	)

	await validateConfig(configWithoutSchemaAttribute)

	return configWithoutSchemaAttribute
}

export const getConfigWithDefaultValues = async (
	config?: GeneratorConfig | undefined,
	shouldReadConfigFromDisk = true,
): Promise<GeneratorConfigWithDefaultValues> =>
	applyDefaultValues({
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		...(config as unknown as any),
		...(shouldReadConfigFromDisk ? await readConfig() : {}),
	})
