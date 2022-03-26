module.exports = [
	{
		name: 'i18n-string',
		path: 'dist/i18n.string.min.js',
		limit: '948 b',
	},
	{
		name: 'typed-i18n-string',
		path: 'dist/i18n.typed.string.min.js',
		limit: '953 b',
	},
	{
		name: 'i18n-object',
		path: 'dist/i18n.object.min.js',
		limit: '1090 b',
	},
	{
		name: 'typed-i18n-object',
		path: 'dist/i18n.typed.object.min.js',
		limit: '1095 b',
	},
	{
		name: 'i18n-instance',
		path: 'dist/i18n.instance.min.js',
		limit: '1122 b',
	},
	{
		name: 'all together',
		path: 'dist/i18n.all.min.js',
		limit: '1193 b',
	},
	{
		name: 'angular-adapter',
		path: 'angular/index.min.mjs',
		limit: '1398 b',
		ignore: ['angular'],
	},
	{
		name: 'react-context',
		path: 'react/index.min.mjs',
		limit: '1576 b',
		ignore: ['react'],
	},
	{
		name: 'svelte-store',
		path: 'svelte/index.min.mjs',
		limit: '1345 b',
		ignore: ['svelte'],
	},
	{
		name: 'vue-plugin',
		path: 'vue/index.min.mjs',
		limit: '1257 b',
		ignore: ['vue'],
	},
]
