module.exports = [
	{
		name: 'i18n-string',
		path: 'dist/i18n.string.min.js',
		limit: '1000 b',
	},
	{
		name: 'i18n-object',
		path: 'dist/i18n.object.min.js',
		limit: '1070 b',
	},
	{
		name: 'i18n-instance',
		path: 'dist/i18n.instance.min.js',
		limit: '1099 b',
	},
	{
		name: 'all together',
		path: 'dist/i18n.all.min.js',
		limit: '1153 b',
	},
	{
		name: 'angular-adapter',
		path: 'angular/angular-service.min.cjs',
		limit: '2017 b',
		ignore: ['angular'],
	},
	{
		name: 'react-context',
		path: 'react/react-context.min.cjs',
		limit: '1478 b',
		ignore: ['react'],
	},
	{
		name: 'svelte-store',
		path: 'svelte/svelte-store.min.cjs',
		limit: '1414 b',
		ignore: ['svelte'],
	},
	{
		name: 'vue-plugin',
		path: 'vue/vue-plugin.min.cjs',
		limit: '1332 b',
		ignore: ['vue'],
	},
]
