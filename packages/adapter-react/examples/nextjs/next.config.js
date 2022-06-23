/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ["de", "en", 'it'],
    defaultLocale: "en",
  },
  reactStrictMode: true,
}

module.exports = nextConfig
