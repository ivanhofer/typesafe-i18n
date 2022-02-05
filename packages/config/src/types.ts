import type { Locale } from '../../runtime/src/core'

export type Adapters = 'angular' | 'node' | 'react' | 'svelte' | 'vue'

export type OutputFormats = 'TypeScript' | 'JavaScript'

export type GeneratorConfig = {
	$schema?: string

	baseLocale?: Locale

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
	generateOnlyTypes?: boolean

	banner?: string
}

export type RollupConfig = {
	locales?: Locale[]
}

export type GeneratorConfigWithDefaultValues = GeneratorConfig & {
	baseLocale: Locale

	tempPath: string
	outputPath: string
	outputFormat: OutputFormats
	typesFileName: string
	utilFileName: string
	formattersTemplateFileName: string
	typesTemplateFileName: string
	esmImports: boolean

	generateOnlyTypes: boolean
	banner: string
}
