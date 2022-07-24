import { resolve } from 'path'
import { doesPathExist, importFile, writeConfigFile } from '../../generator/src/utils/file.utils.mjs'
import { version } from '../../version'
import type { GeneratorConfig, GeneratorConfigWithDefaultValues } from './types.mjs'
import { validateConfig } from './validation.mjs'

export const writeConfigToFile = async (config: GeneratorConfig) =>
	writeConfigFile({ ...config, $schema: `https://unpkg.com/typesafe-i18n@${version}/schema/typesafe-i18n.json` })

export const doesConfigFileExist = async () => doesPathExist(resolve('.typesafe-i18n.json'))

export const readRawConfig = async () =>
	(await importFile<GeneratorConfig & { $schema?: string }>(resolve('.typesafe-i18n.json'), false)) || {}

export const readConfig = async (): Promise<GeneratorConfig> => {
	const generatorConfig = await readRawConfig()

	// remove "$schema" property
	const configWithoutSchemaAttribute = Object.fromEntries(
		Object.entries(generatorConfig).filter(([key]) => key !== '$schema'),
	)

	await validateConfig(configWithoutSchemaAttribute)

	return configWithoutSchemaAttribute
}

export const getConfigWithDefaultValues = async (
	config?: GeneratorConfig | undefined,
	shouldReadConfig = true,
): Promise<GeneratorConfigWithDefaultValues> => ({
	baseLocale: 'en',

	tempPath: './node_modules/typesafe-i18n/temp-output/',
	outputPath: './src/i18n/',
	outputFormat: 'TypeScript',
	typesFileName: 'i18n-types',
	utilFileName: 'i18n-util',
	formattersTemplateFileName: 'formatters',
	typesTemplateFileName: 'custom-types',
	esmImports: false,
	adapter: undefined,

	generateOnlyTypes: false,
	banner: '/* eslint-disable */',
	runAfterGenerator: undefined,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	...(config as unknown as any),
	...(shouldReadConfig ? await readConfig() : {}),
})
