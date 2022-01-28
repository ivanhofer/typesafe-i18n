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
		path: 'dist/i18n.min.js',
		limit: '1119 b',
	},
	{
		name: 'all together',
		path: 'dist/i18n.all.min.js',
		limit: '1171 b',
	},
	{
		name: 'angular-adapter',
		path: 'angular/angular-service.min.cjs',
		limit: '1415 b',
		ignore: ['angular'],
	},
	{
		name: 'react-context',
		path: 'react/react-context.min.cjs',
		limit: '1578 b',
		ignore: ['react'],
	},
	{
		name: 'svelte-store',
		path: 'svelte/svelte-store.min.cjs',
		limit: '1552 b',
		ignore: ['svelte'],
	},
	{
		name: 'vue-plugin',
		path: 'vue/vue-plugin.min.cjs',
		limit: '1395 b',
		ignore: ['vue'],
	},
]
