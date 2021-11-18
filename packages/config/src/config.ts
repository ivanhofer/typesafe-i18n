import path from 'path'
import { doesPathExist, importFile, writeConfigFile } from '../../generator/src/file-utils'
import { version } from '../../version'
import { Config, GeneratorConfig, GeneratorConfigWithDefaultValues } from './types'

export const writeConfigToFile = async (config: GeneratorConfig) =>
	writeConfigFile({ $schema: `https://unpkg.com/typesafe-i18n@${version}/schema/typesafe-i18n.json`, ...config })

export const doesConfigFileExist = async () => doesPathExist(path.resolve('.typesafe-i18n.json'))

export const readConfig = async (config?: GeneratorConfig | undefined): Promise<Config> => {
	const generatorConfig = {
		...config,
		...((await importFile<GeneratorConfig>(path.resolve('.typesafe-i18n.json'), false)) || {}),
	}

	// remove "$schema" property
	return Object.fromEntries(Object.entries(generatorConfig).filter(([key]) => key !== '$schema'))
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
