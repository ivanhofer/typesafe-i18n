import { createLogger } from '../../generator/src/generator-util'

const logger = createLogger(console, true)

// eslint-disable-next-line @typescript-eslint/ban-types
export const validateConfig = (config?: {}): void => {
	if (!config) {
		return
	}
	const keys = Object.keys(config)
	if (keys.length !== 0 && (keys.length > 1 || !keys.includes('locales'))) {
		logger.error(
			'Deprecated config. Please use the `.typesafe-i18n.json`-file instead. See https://github.com/ivanhofer/typesafe-i18n#options',
		)
	}
}
