import path from 'path'
import { importFile } from './types-generator/file-utils'
import type { GeneratorConfig } from './types-generator/generator'
import { setDefaultConfigValuesIfMissing } from './types-generator/generator'
import { startWatcher } from './types-generator/watcher'

const autowatch = async () => {
	const config = (await importFile<GeneratorConfig>(path.resolve('.langauge.json'), false)) || {}

	startWatcher(setDefaultConfigValuesIfMissing(config))
}

autowatch()
