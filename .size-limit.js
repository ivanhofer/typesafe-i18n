module.exports = [
	{
		name: 'i18n-string',
		path: 'dist/i18n.string.min.js',
		limit: '945 b',
	},
	{
		name: 'typed-i18n-string',
		path: 'dist/i18n.typed.string.min.js',
		limit: '949 b',
	},
	{
		name: 'i18n-object',
		path: 'dist/i18n.object.min.js',
		limit: '1086 b',
	},
	{
		name: 'typed-i18n-object',
		path: 'dist/i18n.typed.object.min.js',
		limit: '1090 b',
	},
	{
		name: 'i18n-instance',
		path: 'dist/i18n.instance.min.js',
		limit: '1117 b',
	},
	{
		name: 'all together',
		path: 'dist/i18n.all.min.js',
		limit: '1192 b',
	},
	{
		name: 'adapter-angular',
		path: 'angular/index.min.mjs',
		limit: '1225 b',
		ignore: ['angular'],
	},
	{
		name: 'adapter-react',
		path: 'react/index.min.mjs',
		limit: '1560 b',
		ignore: ['react'],
	},
	{
		name: 'adapter-solid',
		path: 'solid/index.min.mjs',
		limit: '1402 b',
		ignore: ['solid-js'],
	},
	{
		name: 'adapter-svelte',
		path: 'svelte/index.min.mjs',
		limit: '1339 b',
		ignore: ['svelte'],
	},
	{
		name: 'adapter-vue',
		path: 'vue/index.min.mjs',
		limit: '1253 b',
		ignore: ['vue'],
	},
]
