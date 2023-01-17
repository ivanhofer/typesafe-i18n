import type { GeneratorConfig, GeneratorConfigWithDefaultValues } from './types.mjs';

export const applyDefaultValues = async (
	config?: GeneratorConfig | undefined,
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
})

type Fs = { readFile: (path: string | Buffer | URL) => Promise<string | Buffer> }

const readConfigFromDisk = async (fs: Fs) => {
	const content = await fs.readFile('.typesafe-i18n.json').catch(() => '{}')

	return JSON.parse((content.toString())) as GeneratorConfig & { $schema?: string }
}

export const getConfig = async (fs: Fs) => {
	const config = await readConfigFromDisk(fs)

	return applyDefaultValues(config)
}
