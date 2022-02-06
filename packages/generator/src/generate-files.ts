import type { GeneratorConfigWithDefaultValues } from '../../config/src/types'
import type { BaseTranslation, Locale } from '../../runtime/src/core'
import { generateAngularAdapter } from './files/generate-adapter-angular'
import { generateNodeAdapter } from './files/generate-adapter-node'
import { generateReactAdapter } from './files/generate-adapter-react'
import { generateSvelteAdapter } from './files/generate-adapter-svelte'
import { generateVueAdapter } from './files/generate-adapter-vue'
import { generateFormattersTemplate } from './files/generate-template-formatters'
import { generateCustomTypesTemplate } from './files/generate-template-types'
import { generateTypes } from './files/generate-types'
import { generateUtil } from './files/generate-util'
import { generateAsyncUtil } from './files/generate-util-async'
import { generateSyncUtil } from './files/generate-util-sync'
import { generateDictionaryFiles } from './generate-dictionary'
import { logger as defaultLogger, Logger, TypescriptVersion } from './generator-util'
import { configureOutputHandler } from './output-handler'

export const generate = async (
	translations: BaseTranslation | BaseTranslation[],
	config: GeneratorConfigWithDefaultValues = {} as GeneratorConfigWithDefaultValues,
	version: TypescriptVersion,
	logger: Logger = defaultLogger,
	forceOverride = false,
	locales: Locale[] = [],
	namespaces: string[] = [],
): Promise<void> => {
	configureOutputHandler(config, version)

	const hasCustomTypes = await generateTypes({ ...config, translations, locales, namespaces }, logger)

	const promises: Promise<unknown>[] = []

	if (hasCustomTypes) {
		promises.push(generateCustomTypesTemplate(config, forceOverride))
	}

	promises.push(generateDictionaryFiles(config, forceOverride))

	if (config.generateOnlyTypes) return

	promises.push(generateFormattersTemplate(config, forceOverride))

	promises.push(generateUtil(config, locales))
	promises.push(generateSyncUtil(config, locales))
	promises.push(generateAsyncUtil(config, locales, namespaces))

	switch (config.adapter) {
		case 'angular':
			promises.push(generateAngularAdapter(config)) // TODO: add namespace support
			break
		case 'node':
			promises.push(generateNodeAdapter(config)) // TODO: add namespace support
			break
		case 'react':
			promises.push(generateReactAdapter(config)) // TODO: add namespace support
			break
		case 'svelte':
			promises.push(generateSvelteAdapter(config))
			break
		case 'vue':
			promises.push(generateVueAdapter(config)) // TODO: add namespace support
			break
	}

	await Promise.all(promises)
}
