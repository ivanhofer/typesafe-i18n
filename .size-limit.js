module.exports = [
	{
		name: 'i18n-string',
		path: 'dist/i18n.string.min.js',
		limit: '987 b',
	},
	{
		name: 'typed-i18n-string',
		path: 'dist/i18n.typed.string.min.js',
		limit: '991 b',
	},
	{
		name: 'i18n-object',
		path: 'dist/i18n.object.min.js',
		limit: '1128 b',
	},
	{
		name: 'typed-i18n-object',
		path: 'dist/i18n.typed.object.min.js',
		limit: '1134 b',
	},
	{
		name: 'i18n-instance',
		path: 'dist/i18n.instance.min.js',
		limit: '1159 b',
	},
	{
		name: 'all together',
		path: 'dist/i18n.all.min.js',
		limit: '1233 b',
	},
	{
		name: 'adapter-angular',
		path: 'angular/index.min.mjs',
		limit: '1440 b',
		ignore: ['angular'],
	},
	{
		name: 'adapter-react',
		path: 'react/index.min.mjs',
		limit: '1618 b',
		ignore: ['react'],
	},
	{
		name: 'adapter-solid',
		path: 'solid/index.min.mjs',
		limit: '1447 b',
		ignore: ['solid-js'],
	},
	{
		name: 'adapter-svelte',
		path: 'svelte/index.min.mjs',
		limit: '1381 b',
		ignore: ['svelte'],
	},
	{
		name: 'adapter-vue',
		path: 'vue/index.min.mjs',
		limit: '1299 b',
		ignore: ['vue'],
	},
]
