module.exports = [
	{
		name: 'i18n-string',
		path: 'dist/i18n.string.min.js',
		limit: '987 b',
	},
	{
		name: 'typed-i18n-string',
		path: 'dist/i18n.typed.string.min.js',
		limit: '992 b',
	},
	{
		name: 'i18n-object',
		path: 'dist/i18n.object.min.js',
		limit: '1129 b',
	},
	{
		name: 'typed-i18n-object',
		path: 'dist/i18n.typed.object.min.js',
		limit: '1136 b',
	},
	{
		name: 'i18n-instance',
		path: 'dist/i18n.instance.min.js',
		limit: '1161 b',
	},
	{
		name: 'all together',
		path: 'dist/i18n.all.min.js',
		limit: '1233 b',
	},
	{
		name: 'adapter-angular',
		path: 'angular/index.min.mjs',
		limit: '1438 b',
		ignore: ['angular'],
	},
	{
		name: 'adapter-react',
		path: 'react/index.min.mjs',
		limit: '1617 b',
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
		limit: '1382 b',
		ignore: ['svelte'],
	},
	{
		name: 'adapter-vue',
		path: 'vue/index.min.mjs',
		limit: '1297 b',
		ignore: ['vue'],
	},
]
