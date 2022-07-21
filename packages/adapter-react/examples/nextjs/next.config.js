/** @type {import('next').NextConfig} */
const nextConfig = {
	i18n: {
		locales: ['default', 'de', 'en', 'it'],
		defaultLocale: 'default',
	},
	reactStrictMode: true,
}

module.exports = nextConfig
