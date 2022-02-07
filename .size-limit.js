module.exports = [
	{
		name: 'i18n-string',
		path: 'dist/i18n.string.min.js',
		limit: '950 b',
	},
	{
		name: 'i18n-object',
		path: 'dist/i18n.object.min.js',
		limit: '1065 b',
	},
	{
		name: 'i18n-instance',
		path: 'dist/i18n.instance.min.js',
		limit: '1093 b',
	},
	{
		name: 'all together',
		path: 'dist/i18n.all.min.js',
		limit: '1144 b',
	},
	{
		name: 'angular-adapter',
		path: 'angular/angular-service.min.mjs',
		limit: '1371 b',
		ignore: ['angular'],
	},
	{
		name: 'react-context',
		path: 'react/react-context.min.mjs',
		limit: '1583 b',
		ignore: ['react'],
	},
	{
		name: 'svelte-store',
		path: 'svelte/svelte-store.min.mjs',
		limit: '1323 b',
		ignore: ['svelte'],
	},
	{
		name: 'vue-plugin',
		path: 'vue/vue-plugin.min.mjs',
		limit: '1228 b',
		ignore: ['vue'],
	},
]
