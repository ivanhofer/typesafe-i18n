const { getDefaultConfig } = require('expo/metro-config');

module.exports = (() => {
	const config = getDefaultConfig(__dirname);

	const { resolver } = config;

	config.resolver = {
		...resolver,
		// .cjs needed for typesafe-i18n
		sourceExts: [...resolver.sourceExts, 'cjs'],
	};

	return config;
})();