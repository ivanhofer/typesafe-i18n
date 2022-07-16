import type { Locale } from '../../runtime/src/core'

export type Adapters = 'angular' | 'node' | 'react' | 'solid' | 'svelte' | 'vue'

export type OutputFormats = 'TypeScript' | 'JavaScript'

type NoAdaptersConfig = {
	adapter?: never
	adapters?: never
}
type SingleAdapterConfig = {
	adapter: Adapters
	adapters?: never
}

type MultipleAdaptersConfig = {
	adapter?: never
	adapters: Adapters[]
}

type AdapterConfig = NoAdaptersConfig | SingleAdapterConfig | MultipleAdaptersConfig

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

	adapterFileName?: string
	generateOnlyTypes?: boolean

	banner?: string
	runAfterGenerator?: string | undefined
} & AdapterConfig

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
	runAfterGenerator: string | undefined
}
