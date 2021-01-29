import { langaugeStringWrapper } from './core/util.string'
import { langaugeObjectWrapper } from './core/util.object'
import { langauge } from './core/util.instance'
import { langaugeLoader, langaugeLoaderAsync } from './core/util.loader'

//@ts-ignore
window.langauge = {
	init: langauge,
	initStringWrapper: langaugeStringWrapper,
	initObjectWrapper: langaugeObjectWrapper,
	initLoader: langaugeLoader,
	initLoaderAsync: langaugeLoaderAsync,
}
