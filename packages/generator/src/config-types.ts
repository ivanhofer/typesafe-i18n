export type Adapters = 'angular' | 'node' | 'react' | 'svelte'

export type OutputFormats = 'TypeScript' | 'JavaScript'

export type GeneratorConfig = {
	baseLocale?: string

	tempPath?: string
	outputPath?: string
	outputFormat?: OutputFormats
	typesFileName?: string
	utilFileName?: string
	formattersTemplateFileName?: string
	typesTemplateFileName?: string
	esmImports?: boolean

	adapter?: Adapters
	adapterFileName?: string
	loadLocalesAsync?: boolean
	generateOnlyTypes?: boolean

	banner?: string
}

export type RollupConfig = {
	locales?: string[]
}

export type Config = GeneratorConfig & RollupConfig

export type GeneratorConfigWithDefaultValues = GeneratorConfig & {
	baseLocale: string
	locales: string[]

	tempPath: string
	outputPath: string
	outputFormat: OutputFormats
	typesFileName: string
	utilFileName: string
	formattersTemplateFileName: string
	typesTemplateFileName: string
	esmImports: boolean

	loadLocalesAsync: boolean
	generateOnlyTypes: boolean
	banner: string
}
