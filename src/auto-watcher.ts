import path from 'path'
import { importFile } from './types-generator/file-utils'
import type { WatcherConfig } from './types-generator/watcher'
import { startWatcher } from './types-generator/watcher'

const autowatch = async () => {
	const config = (await importFile<WatcherConfig>(path.resolve('.langauge.json'), false)) || {}

	startWatcher(config)
}

autowatch()
