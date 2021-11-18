import path from 'path'
import { doesPathExist, importFile, writeConfigFile } from '../../generator/src/file-utils'
import { version } from '../../version'
import type { Config, GeneratorConfig, GeneratorConfigWithDefaultValues } from './types'
import { validateConfig } from './validation'

export const writeConfigToFile = async (config: GeneratorConfig) =>
	writeConfigFile({ ...config, $schema: `https://unpkg.com/typesafe-i18n@${version}/schema/typesafe-i18n.json` })

export const doesConfigFileExist = async () => doesPathExist(path.resolve('.typesafe-i18n.json'))

export const readRawConfig = async () =>
	(await importFile<GeneratorConfig & { $schema?: string }>(path.resolve('.typesafe-i18n.json'), false)) || {}

export const readConfig = async (config?: GeneratorConfig | undefined): Promise<Config> => {
	const generatorConfig = {
		...config,
		...(await readRawConfig()),
	}

	// remove "$schema" property
	const configWithoutSchemaAttribute = Object.fromEntries(
		Object.entries(generatorConfig).filter(([key]) => key !== '$schema'),
	)

	await validateConfig(configWithoutSchemaAttribute)

	return configWithoutSchemaAttribute
}

export const getConfigWithDefaultValues = async (
	config?: Config | undefined,
	shouldReadConfig = true,
): Promise<GeneratorConfigWithDefaultValues> => ({
	baseLocale: 'en',
	locales: [],

	tempPath: './node_modules/typesafe-i18n/temp-output/',
	outputPath: './src/i18n/',
	outputFormat: 'TypeScript',
	typesFileName: 'i18n-types',
	utilFileName: 'i18n-util',
	formattersTemplateFileName: 'formatters',
	typesTemplateFileName: 'custom-types',
	esmImports: false,

	loadLocalesAsync: true,
	generateOnlyTypes: false,
	banner: '/* eslint-disable */',
	...(shouldReadConfig ? await readConfig(config) : {}),
})
